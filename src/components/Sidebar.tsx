import DraggableItem from "./Draggable";
import "./style/sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <span className="comps-title">Components</span>
      <div className="comps-cont">
        <DraggableItem type="header" />
        <DraggableItem type="footer" />
      </div>
    </aside>
  );
}

export default Sidebar;
