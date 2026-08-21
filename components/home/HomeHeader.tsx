.inner {
  width: calc(100% - 80px);
  max-width: 1380px;
  min-height: 80px;
  margin: 0 auto;

  display: grid;
  grid-template-columns: 250px 1fr auto;
  align-items: center;
  gap: 20px;
}

/* NAVIGATION */

.navigation {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 30px;

  transform: translateX(-22px);
}

.dropdown {
  position: relative;
}

.navButton,
.navLink {
  color: #1266e9;
  background: transparent;
  border: 0;

  font-family: inherit;
  font-size: 13.5px;
  font-weight: 800;

  text-decoration: none;
  white-space: nowrap;

  cursor: pointer;

  transition:
    color 0.2s ease,
    opacity 0.2s ease;
}

.navButton {
  padding: 25px 0;

  display: flex;
  align-items: center;
  gap: 6px;
}

.navButton:hover,
.navLink:hover {
  color: #0d55c7;
}

/* RIGHT SIDE */

.actions {
  display: flex;
  align-items: center;
  gap: 8px;

  margin-right: 18px;
}

.loginButton,
.registerButton,
.accountButton {
  min-height: 39px;
  padding: 0 14px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  border-radius: 9px;

  color: #ffffff;

  background: #1266e9;
  border: 1px solid #1266e9;

  text-decoration: none;
  white-space: nowrap;

  font-size: 12px;
  font-weight: 800;
}

.language {
  margin-left: 8px;
  margin-right: 4px;

  display: flex;
  align-items: center;
  gap: 6px;
}
