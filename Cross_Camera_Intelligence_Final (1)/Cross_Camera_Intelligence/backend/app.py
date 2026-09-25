import os
import glob
from pathlib import Path
import streamlit as st
import pandas as pd
import folium
from folium import plugins
from streamlit_folium import st_folium

from config import (
    BASE_DIR,
    SNAPSHOT_DIR,
    OUTPUT_DIR,
    LOCAL_CAMERAS,
    WATCHLIST,
    INGESTION_MODE,
)
from database import (
    init_db,
    get_all_detections,
    get_all_alerts,
    export_detections_csv,
    get_connection,
)
from correlation import correlate_by_plate, correlate_by_visual
from ingestion import process_camera_stream

# Page configuration
st.set_page_config(
    page_title="Gujarat Police — Cross-Camera AI Intelligence",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Custom tactical CSS styling for a state-of-the-art police command center look
st.markdown("""
<style>
    /* Global Tactical Theme */
    .stApp {
        background-color: #0b0f19;
        color: #e2e8f0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    
    /* Top Header Bar */
    .command-header {
        background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%);
        border: 1px solid #312e81;
        border-radius: 12px;
        padding: 20px 28px;
        margin-bottom: 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    }
    
    .command-title {
        font-size: 26px;
        font-weight: 800;
        color: #f8fafc;
        letter-spacing: -0.5px;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .command-subtitle {
        font-size: 13px;
        color: #94a3b8;
        margin-top: 4px;
        text-transform: uppercase;
        letter-spacing: 1.5px;
    }
    
    /* Status Badge */
    .badge-live {
        background: rgba(16, 185, 129, 0.15);
        color: #10b981;
        border: 1px solid #059669;
        padding: 4px 12px;
        border-radius: 9999px;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.5px;
    }
    
    /* Tactical Metric Cards */
    .metric-card {
        background: #111827;
        border: 1px solid #1f2937;
        border-radius: 10px;
        padding: 16px 20px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
    .metric-title {
        font-size: 12px;
        font-weight: 600;
        color: #9ca3af;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    .metric-value {
        font-size: 30px;
        font-weight: 800;
        color: #f9fafb;
        margin-top: 4px;
    }
    
    /* Watchlist Alert Banner Card */
    .alert-card {
        background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(153, 27, 27, 0.1) 100%);
        border: 1px solid #ef4444;
        border-left: 6px solid #dc2626;
        border-radius: 8px;
        padding: 14px 18px;
        margin-bottom: 12px;
        animation: pulse 2s infinite;
    }
    
    .alert-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 700;
        color: #fca5a5;
        font-size: 15px;
    }
    
    .alert-plate {
        background: #b91c1c;
        color: #ffffff;
        padding: 2px 8px;
        border-radius: 4px;
        font-family: monospace;
        font-size: 14px;
        font-weight: 800;
    }
    
    /* Confidence Badges */
    .conf-high {
        background: rgba(16, 185, 129, 0.18);
        color: #34d399;
        border: 1px solid #10b981;
        padding: 4px 10px;
        border-radius: 6px;
        font-weight: 700;
        font-size: 12px;
    }
    .conf-low {
        background: rgba(245, 158, 11, 0.18);
        color: #fbbf24;
        border: 1px solid #f59e0b;
        padding: 4px 10px;
        border-radius: 6px;
        font-weight: 700;
        font-size: 12px;
    }
</style>
""", unsafe_allow_html=True)

# Ensure DB initialized
init_db()

# Top Navigation / Title Header
st.markdown("""
<div class="command-header">
    <div>
        <div class="command-title">
            <span>🛡️ GUJARAT POLICE SURVEILLANCE INTELLIGENCE</span>
        </div>
        <div class="command-subtitle">
            Cross-Camera Multi-Target Correlation & Real-Time ANPR Analytics Grid
        </div>
    </div>
    <div>
        <span class="badge-live">● SYSTEM ACTIVE (MODE A: LOCAL MULTI-CAM)</span>
    </div>
</div>
""", unsafe_allow_html=True)

# Quick Stats KPI row
conn = get_connection()
c = conn.cursor()
c.execute("SELECT COUNT(*) FROM detections")
total_dets = c.fetchone()[0]
c.execute("SELECT COUNT(*) FROM alerts")
total_alerts = c.fetchone()[0]
c.execute("SELECT COUNT(DISTINCT plate_text) FROM detections WHERE plate_text IS NOT NULL AND plate_text != ''")
unique_plates = c.fetchone()[0]
conn.close()

col1, col2, col3, col4 = st.columns(4)
with col1:
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-title">Total AI Detections</div>
        <div class="metric-value" style="color: #60a5fa;">{total_dets}</div>
    </div>
    """, unsafe_allow_html=True)
with col2:
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-title">Active Grid Cameras</div>
        <div class="metric-value" style="color: #34d399;">{len(LOCAL_CAMERAS)}</div>
    </div>
    """, unsafe_allow_html=True)
with col3:
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-title">Watchlist Alerts Fired</div>
        <div class="metric-value" style="color: #f87171;">{total_alerts}</div>
    </div>
    """, unsafe_allow_html=True)
with col4:
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-title">Distinct Vehicles Tracked</div>
        <div class="metric-value" style="color: #fbbf24;">{unique_plates}</div>
    </div>
    """, unsafe_allow_html=True)

st.markdown("<div style='margin-bottom: 24px;'></div>", unsafe_allow_html=True)

# Sidebar Controls & System Configuration
with st.sidebar:
    st.header("⚙️ System Control")
    
    st.subheader("Ingestion Mode")
    mode_selection = st.radio(
        "Current Source:",
        ["Mode A: Local Video Files (Demo Grid)", "Mode B: Live RTSP Stream Grid"],
        index=0,
    )
    
    if "Mode B" in mode_selection:
        st.info("Mode B configured: TCP transport enforced, PTS timing active, exponential backoff (2s -> 30s) enabled.")
        st.text_input("Catalogue API:", "http://127.0.0.1:8000/api/ingest", disabled=True)
    
    st.divider()
    
    st.subheader("🚨 Registered Watchlist")
    for plate, reason in WATCHLIST.items():
        with st.expander(f"📌 {plate}"):
            st.caption(f"**Reason:** {reason}")
            if st.button(f"Search {plate}", key=f"side_search_{plate}"):
                st.session_state["search_query"] = plate
                st.session_state["search_mode"] = "plate"

    st.divider()
    
    st.subheader("📥 Export Deliverables")
    if st.button("Generate CSV Export", use_container_width=True):
        csv_path = BASE_DIR / "detections_export.csv"
        export_detections_csv(str(csv_path))
        st.success("Export generated successfully!")
        with open(csv_path, "rb") as f:
            st.download_button(
                label="⬇️ Download Detections CSV",
                data=f,
                file_name="detections_export.csv",
                mime="text/csv",
                use_container_width=True,
            )

# Main Application Tabs
tab_journey, tab_alerts, tab_feed, tab_video = st.tabs([
    "📍 Cross-Camera Journey & Route Map",
    "🚨 Watchlist Alerts Log",
    "📸 Live Detection Feed & Explorer",
    "🎬 Annotated Video Output",
])

# Initialize session state for search
if "search_query" not in st.session_state:
    st.session_state["search_query"] = "GJ01AB1234"
if "search_mode" not in st.session_state:
    st.session_state["search_mode"] = "plate"

# ==========================================
# TAB 1: CROSS-CAMERA JOURNEY & ROUTE MAP
# ==========================================
with tab_journey:
    st.subheader("🎯 Cross-Camera Target Correlation & Route Reconstruction")
    st.caption("Correlate multi-camera sightings into chronological trajectories across the Ahmedabad police surveillance corridor.")
    
    # Mode selector: Plate vs Visual Attribute
    col_mode1, col_mode2 = st.columns([1, 3])
    with col_mode1:
        search_type = st.radio(
            "Correlation Method:",
            ["License Plate Match (High Confidence)", "Visual Attributes: Person/Vehicle (Lower Confidence)"],
            index=0 if st.session_state["search_mode"] == "plate" else 1,
        )
    
    if "License Plate" in search_type:
        st.session_state["search_mode"] = "plate"
        col_s1, col_s2, col_s3, col_s4 = st.columns([3, 1, 1, 1])
        with col_s1:
            plate_input = st.text_input(
                "Enter License Plate Number:",
                value=st.session_state.get("search_query", "GJ01AB1234"),
                placeholder="e.g. GJ01AB1234",
            )
        with col_s2:
            st.write("&nbsp;")
            if st.button("🚨 Stolen Car (GJ01AB1234)", use_container_width=True):
                plate_input = "GJ01AB1234"
                st.session_state["search_query"] = "GJ01AB1234"
        with col_s3:
            st.write("&nbsp;")
            if st.button("🚨 Armed Robbery (GJ05CD5678)", use_container_width=True):
                plate_input = "GJ05CD5678"
                st.session_state["search_query"] = "GJ05CD5678"
        with col_s4:
            st.write("&nbsp;")
            if st.button("🚙 Blue Sedan (GJ01XY9876)", use_container_width=True):
                plate_input = "GJ01XY9876"
                st.session_state["search_query"] = "GJ01XY9876"
                
        correlation_result = correlate_by_plate(plate_input)
        
    else:
        st.session_state["search_mode"] = "visual"
        col_v1, col_v2, col_v3 = st.columns(3)
        with col_v1:
            obj_class_input = st.selectbox("Target Object Class:", ["person", "car", "bus", "truck", "motorcycle", "backpack"], index=0)
        with col_v2:
            color_input = st.selectbox("Dominant Color:", ["Red", "White", "Blue", "Black", "Silver/Gray", "Yellow"], index=0)
        with col_v3:
            window_slider = st.slider("Correlation Time Window (Minutes):", 1, 15, 8)
            
        correlation_result = correlate_by_visual(
            object_class=obj_class_input,
            color=color_input,
            time_window_sec=float(window_slider * 60),
        )

    st.markdown("<div style='margin-bottom: 16px;'></div>", unsafe_allow_html=True)
    
    # Render Correlation Results
    hops = correlation_result.get("journey", [])
    total_hops = correlation_result.get("total_hops", 0)
    conf_score = correlation_result.get("confidence_score", 0.0)
    conf_type = correlation_result.get("confidence_type", "None")
    
    if total_hops == 0:
        st.warning(correlation_result.get("message", "No matching sightings found across camera grid."))
    else:
        # Confidence Banner
        badge_style = "conf-high" if conf_score >= 0.8 else "conf-low"
        st.markdown(f"""
        <div style="background: #111827; border: 1px solid #1f2937; border-radius: 8px; padding: 12px 18px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <span style="font-weight: 700; font-size: 16px; color: #f8fafc;">Correlated Movement Trajectory</span>
                <span style="margin-left: 12px; color: #94a3b8; font-size: 14px;">Visits: <b>{total_hops} Checkpoints</b></span>
            </div>
            <div>
                <span class="{badge_style}">{conf_type} (Score: {conf_score:.2f})</span>
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        # Split view: Route Map on Left, Detailed Checkpoint Timeline on Right
        map_col, details_col = st.columns([1.1, 0.9])
        
        with map_col:
            st.markdown("##### 🗺️ Geographic Movement Corridor (Ahmedabad Grid)")
            
            # Center on Ahmedabad coordinates
            m = folium.Map(
                location=[23.0298, 72.5250],
                zoom_start=13,
                tiles="CartoDB dark_matter",
            )
            
            # Plot all known camera checkpoint locations
            for cam in LOCAL_CAMERAS:
                folium.CircleMarker(
                    location=[cam["latitude"], cam["longitude"]],
                    radius=7,
                    color="#475569",
                    fill=True,
                    fill_color="#1e293b",
                    fill_opacity=0.7,
                    popup=f"<b>Checkpoint:</b> {cam['name']}<br><b>ID:</b> {cam['id']}",
                    tooltip=f"CCTV: {cam['name']}",
                ).add_to(m)
                
            # If trajectory coordinates exist, draw connecting polyline and hop markers
            route_coords = correlation_result.get("coordinates", [])
            if len(route_coords) > 1:
                folium.PolyLine(
                    locations=route_coords,
                    color="#06b6d4",
                    weight=4,
                    opacity=0.9,
                    dash_array="8",
                    tooltip="Suspect Transit Route",
                ).add_to(m)
                
            # Numbered hop markers for visited checkpoints
            for h in hops:
                lat = h.get("latitude")
                lon = h.get("longitude")
                hop_num = h.get("hop_number")
                cam_name = h.get("camera_name")
                speed = h.get("estimated_speed_kmh", 0.0)
                time_iso = h.get("timestamp_iso", "")
                snap_path = h.get("snapshot_path", "")
                
                popup_html = f"""
                <div style="font-family: sans-serif; font-size: 12px; width: 200px;">
                    <b style="color: #0284c7;">Hop #{hop_num}: {cam_name}</b><br>
                    <b>Time:</b> {time_iso}<br>
                    <b>Speed:</b> {speed} km/h<br>
                </div>
                """
                
                # Glowing marker for target
                folium.Marker(
                    location=[lat, lon],
                    popup=folium.Popup(popup_html, max_width=240),
                    tooltip=f"Hop #{hop_num}: {cam_name}",
                    icon=folium.DivIcon(
                        html=f"""
                        <div style="
                            background-color: #ef4444;
                            color: white;
                            border-radius: 50%;
                            width: 26px;
                            height: 26px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-weight: 800;
                            font-size: 13px;
                            border: 2px solid white;
                            box-shadow: 0 0 10px rgba(239, 68, 68, 0.8);
                        ">{hop_num}</div>
                        """
                    )
                ).add_to(m)
                
            st_folium(m, width=None, height=440, returned_objects=[])

        with details_col:
            st.markdown("##### ⏱️ Sequenced Checkpoint Timeline")
            
            for h in hops:
                hop_num = h.get("hop_number")
                cam_name = h.get("camera_name")
                time_iso = h.get("timestamp_iso")
                transit_delta = h.get("time_delta_from_prev_sec", 0.0)
                dist_m = h.get("distance_from_prev_m", 0.0)
                speed = h.get("estimated_speed_kmh", 0.0)
                snap = h.get("snapshot_path")
                plate = h.get("plate_text") or "N/A"
                color = h.get("color")
                obj_cls = h.get("object_class")
                
                transit_str = "Origin / Entry Point" if hop_num == 1 else f"Transit: +{transit_delta:.1f}s | {dist_m:.0f}m | ~{speed:.1f} km/h"
                
                with st.container():
                    col_h1, col_h2 = st.columns([1, 2.5])
                    with col_h1:
                        if snap and os.path.exists(str(BASE_DIR / snap)):
                            st.image(str(BASE_DIR / snap), use_container_width=True)
                        else:
                            st.caption("[Snapshot]")
                    with col_h2:
                        st.markdown(f"**Hop #{hop_num}: {cam_name}**")
                        st.caption(f"🕒 **Time:** {time_iso} | 🚗 **Target:** {color} {obj_cls} ({plate})")
                        st.markdown(f"<span style='font-size: 12px; color: #38bdf8;'><b>{transit_str}</b></span>", unsafe_allow_html=True)
                    st.divider()

# ==========================================
# TAB 2: WATCHLIST ALERTS LOG
# ==========================================
with tab_alerts:
    st.subheader("🚨 Real-Time Police Watchlist Hits & Alerts")
    st.caption("Instant alerts triggered by automated license plate recognition against active FIRs and Wanted databases.")
    
    alerts = get_all_alerts(limit=50)
    if not alerts:
        st.info("No active watchlist matches currently recorded.")
    else:
        st.write(f"Displaying **{len(alerts)}** most recent alerts:")
        
        for alert in alerts[:15]:
            plate = alert.get("plate_text")
            reason = alert.get("reason")
            cam_id = alert.get("camera_id")
            time_iso = alert.get("timestamp_iso")
            pts = alert.get("timestamp_pts")
            snap = alert.get("snapshot_path")
            
            # Find camera friendly name
            cam_name = cam_id
            for c_info in LOCAL_CAMERAS:
                if c_info["id"] == cam_id:
                    cam_name = c_info["name"]
                    break
                    
            with st.container():
                st.markdown(f"""
                <div class="alert-card">
                    <div class="alert-header">
                        <span>🚨 WATCHLIST HIT: <span class="alert-plate">{plate}</span></span>
                        <span style="font-size: 12px; color: #fca5a5;">{time_iso} (PTS: {pts:.1f}ms)</span>
                    </div>
                    <div style="margin-top: 6px; font-size: 14px; color: #fee2e2;">
                        <b>Warrant / Reason:</b> {reason}
                    </div>
                    <div style="font-size: 13px; color: #cbd5e1; margin-top: 2px;">
                        <b>Checkpoint:</b> {cam_name} ({cam_id})
                    </div>
                </div>
                """, unsafe_allow_html=True)
                
                col_al_img, col_al_btn = st.columns([1, 4])
                with col_al_img:
                    if snap and os.path.exists(str(BASE_DIR / snap)):
                        st.image(str(BASE_DIR / snap), width=130)
                with col_al_btn:
                    if st.button(f"🎯 Correlate Journey for {plate}", key=f"btn_track_{alert['id']}"):
                        st.session_state["search_query"] = plate
                        st.session_state["search_mode"] = "plate"
                        st.rerun()

# ==========================================
# TAB 3: LIVE DETECTION FEED & EXPLORER
# ==========================================
with tab_feed:
    st.subheader("📸 Automated CCTV Detections Repository")
    
    # Filter row
    f_col1, f_col2, f_col3 = st.columns(3)
    with f_col1:
        cam_filter = st.selectbox("Filter Camera:", ["All Cameras"] + [c["name"] for c in LOCAL_CAMERAS])
    with f_col2:
        class_filter = st.selectbox("Filter Class:", ["All Classes", "car", "person", "bus", "truck", "motorcycle", "backpack"])
    with f_col3:
        limit_count = st.slider("Max Records to Display:", 20, 200, 60)
        
    selected_cam_id = None
    if cam_filter != "All Cameras":
        for c_info in LOCAL_CAMERAS:
            if c_info["name"] == cam_filter:
                selected_cam_id = c_info["id"]
                break
                
    selected_cls = None if class_filter == "All Classes" else class_filter
    
    dets = get_all_detections(camera_id=selected_cam_id, object_class=selected_cls, limit=limit_count)
    st.caption(f"Showing **{len(dets)}** detections:")
    
    # Display in responsive grid of cards
    cols_per_row = 4
    for i in range(0, len(dets), cols_per_row):
        row_dets = dets[i:i + cols_per_row]
        cols = st.columns(cols_per_row)
        for col, det in zip(cols, row_dets):
            with col:
                snap = det.get("snapshot_path")
                if snap and os.path.exists(str(BASE_DIR / snap)):
                    st.image(str(BASE_DIR / snap), use_container_width=True)
                st.markdown(f"**{det.get('object_class', '').upper()}** | `{det.get('color')}`")
                plate = det.get("plate_text")
                if plate:
                    st.markdown(f"🏷️ **Plate:** `{plate}`")
                st.caption(f"📍 {det.get('camera_name')}")
                st.caption(f"🕒 {det.get('timestamp_iso')} (Conf: {det.get('confidence'):.2f})")
                st.divider()

# ==========================================
# TAB 4: ANNOTATED OUTPUT VIDEO
# ==========================================
with tab_video:
    st.subheader("🎬 Annotated AI Surveillance Video Player")
    st.caption("Requirement 8 Deliverable: Fully annotated video feeds showing real-time bounding boxes, class labels, and extracted plate text.")
    
    annotated_files = glob.glob(str(OUTPUT_DIR / "annotated_*.mp4"))
    if not annotated_files:
        st.warning("No annotated video files found. Run the ingestion process to generate annotated MP4 files.")
    else:
        file_options = {os.path.basename(f): f for f in annotated_files}
        chosen_video_name = st.selectbox("Select Camera Feed to Play:", list(file_options.keys()))
        video_full_path = file_options[chosen_video_name]
        
        st.video(video_full_path)
        st.caption(f"File: `{video_full_path}` | Size: {os.path.getsize(video_full_path) / 1024:.1f} KB")
