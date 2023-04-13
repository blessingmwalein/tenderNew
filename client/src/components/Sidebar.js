export default function Sidebar({ userType }) {
  return (
    <nav class="sidebar dark_sidebar">
      <div class="logo d-flex justify-content-between">
        <a class="large_logo" href="index.html">
          <img src="/img/logo_white.png" alt />
        </a>
        <a class="small_logo" href="index.html">
          <img src="/img/mini_logo.png" alt />
        </a>
        <div class="sidebar_close_icon d-lg-none">
          <i class="ti-close"></i>
        </div>
      </div>
      <ul id="sidebar_menu">
        
        {userType === "admin" ? (
            <>
            <li class>
            <a href="/" aria-expanded="false">
              <div class="nav_icon_small">
                <img src="/img/menu-icon/1.svg" alt />
              </div>
              <div class="nav_title">
                <span>Dashboard </span>
              </div>
            </a>
          </li>
          <li class>
            <a href="/admin-tenders" aria-expanded="false">
              <div class="nav_icon_small">
                <img src="/img/menu-icon/2.svg" alt />
              </div>
              <div class="nav_title">
                <span>Tenders</span>
              </div>
            </a>
          </li>
          </>
        ) : (
          <li class>
            <a href="/user-tenders" aria-expanded="false">
              <div class="nav_icon_small">
                <img src="/img/menu-icon/2.svg" alt />
              </div>
              <div class="nav_title">
                <span>Tenders</span>
              </div>
            </a>
          </li>
        )}
      </ul>
    </nav>
  );
}
