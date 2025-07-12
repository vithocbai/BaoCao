
import SidebarAdmin from "@pages/admin/SidebarAdmin/SidebarAdmin.jsx";
import NavbarAdmin from "@pages/admin/NavbarAdmin/NavbarAdmin";
import styles from "./AdminLayout.module.scss";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
    return (
        <div className={styles.container}>
            <SidebarAdmin />
            <div className={styles.content}>
                <NavbarAdmin />
                <div className={styles.main}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
