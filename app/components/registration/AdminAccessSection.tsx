"use client";

type AdminPermissions = {
  viewProfiles: boolean;
  editProfiles: boolean;
  editFinderSettings: boolean;
  editLiveChat: boolean;
  viewMessages: boolean;
  replyMessages: boolean;
  markLostFound: boolean;
  addProfiles: boolean;
};

type AdminAccessSectionProps = {
  adminEnabled: boolean;
  setAdminEnabled: (value: boolean) => void;

  adminEmail: string;
  setAdminEmail: (value: string) => void;

  permissions: AdminPermissions;
  setPermissions: (
    value: AdminPermissions
  ) => void;
};

export default function AdminAccessSection({
  adminEnabled,
  setAdminEnabled,
  adminEmail,
  setAdminEmail,
  permissions,
  setPermissions,
}: AdminAccessSectionProps) {
  function updatePermission(
    key: keyof AdminPermissions
  ) {
    setPermissions({
      ...permissions,
      [key]: !permissions[key],
    });
  }

  return (
    <>
      <section className="sectionCard">
        <div className="sectionHeader">
          <div className="sectionNumber">
            02
          </div>

          <div>
            <span>
              SECONDARY ADMIN
            </span>

            <h3>
              დამატებითი ადმინისტრატორი
            </h3>

            <p>
              სურვილის შემთხვევაში შეგიძლიათ
              თქვენს ანგარიშს დაუმატოთ ერთი
              Secondary Admin და ზუსტად
              განსაზღვროთ, რისი ნახვისა და
              შეცვლის უფლება ექნება.
            </p>
          </div>
        </div>

        <div className="adminToggleRow">
          <div>
            <strong>
              Secondary Admin-ის დამატება
            </strong>

            <p>
              ერთი Owner account-ზე შესაძლებელია
              მაქსიმუმ ერთი დამატებითი Admin.
            </p>
          </div>

          <button
            type="button"
            className={
              adminEnabled
                ? "toggle active"
                : "toggle"
            }
            onClick={() =>
              setAdminEnabled(
                !adminEnabled
              )
            }
            aria-pressed={
              adminEnabled
            }
          >
            <span />
          </button>
        </div>

        {adminEnabled && (
          <div className="adminArea">
            <div className="field">
              <label>
                Admin-ის ელფოსტა
                <span>*</span>
              </label>

              <input
                type="email"
                value={adminEmail}
                onChange={(event) =>
                  setAdminEmail(
                    event.target.value
                  )
                }
                placeholder="admin@example.com"
                autoComplete="email"
              />

              <small>
                ამ ელფოსტაზე მოგვიანებით
                გაიგზავნება Admin invitation.
              </small>
            </div>

            <div className="permissionsHeader">
              <span>
                PERMISSIONS
              </span>

              <h4>
                Admin-ის უფლებები
              </h4>

              <p>
                ჩართეთ მხოლოდ ის უფლებები,
                რომლებიც გსურთ Secondary
                Admin-ს ჰქონდეს.
              </p>
            </div>

            <div className="permissionList">
              <PermissionRow
                label="პროფილების ნახვა"
                text="ნახოს Owner account-ზე არსებული QR პროფილები."
                checked={
                  permissions.viewProfiles
                }
                onClick={() =>
                  updatePermission(
                    "viewProfiles"
                  )
                }
              />

              <PermissionRow
                label="პროფილების რედაქტირება"
                text="შეცვალოს ცხოველის ან ნივთის მონაცემები."
                checked={
                  permissions.editProfiles
                }
                onClick={() =>
                  updatePermission(
                    "editProfiles"
                  )
                }
              />

              <PermissionRow
                label="Finder View-ის მართვა"
                text="შეცვალოს დამატებითი ინფორმაციის ხილვადობა."
                checked={
                  permissions.editFinderSettings
                }
                onClick={() =>
                  updatePermission(
                    "editFinderSettings"
                  )
                }
              />

              <PermissionRow
                label="Live Chat-ის მართვა"
                text="ჩართოს ან გამორთოს Live Chat."
                checked={
                  permissions.editLiveChat
                }
                onClick={() =>
                  updatePermission(
                    "editLiveChat"
                  )
                }
              />

              <PermissionRow
                label="შეტყობინებების ნახვა"
                text="ნახოს QR RETURN Live Chat შეტყობინებები."
                checked={
                  permissions.viewMessages
                }
                onClick={() =>
                  updatePermission(
                    "viewMessages"
                  )
                }
              />

              <PermissionRow
                label="შეტყობინებებზე პასუხი"
                text="უპასუხოს Live Chat-ში მიღებულ შეტყობინებებს."
                checked={
                  permissions.replyMessages
                }
                onClick={() =>
                  updatePermission(
                    "replyMessages"
                  )
                }
              />

              <PermissionRow
                label="Lost / Found სტატუსის შეცვლა"
                text="მონიშნოს პროფილი დაკარგულად ან დაბრუნებულად."
                checked={
                  permissions.markLostFound
                }
                onClick={() =>
                  updatePermission(
                    "markLostFound"
                  )
                }
              />

              <PermissionRow
                label="ახალი QR პროფილის დამატება"
                text="დაამატოს ახალი პროფილი Owner-ის ანგარიშზე."
                checked={
                  permissions.addProfiles
                }
                onClick={() =>
                  updatePermission(
                    "addProfiles"
                  )
                }
              />
            </div>

            <div className="lockedPermissions">
              <div className="lockIcon">
                ×
              </div>

              <div>
                <strong>
                  Admin-ს არასოდეს ექნება
                  შემდეგი უფლებები
                </strong>

                <div className="lockedGrid">
                  <span>
                    სხვა Admin-ის დამატება
                  </span>

                  <span>
                    Owner-ის შეცვლა
                  </span>

                  <span>
                    Owner email/password-ის შეცვლა
                  </span>

                  <span>
                    Owner account-ის წაშლა
                  </span>

                  <span>
                    QR კატეგორიის შეცვლა
                  </span>

                  <span>
                    საკუთარი უფლებების შეცვლა
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <style jsx>{`
        .sectionCard {
          margin-top: 16px;
          padding: 25px;

          border: 1px solid #dce6f1;
          border-radius: 16px;

          background: #ffffff;

          box-shadow:
            0 12px 30px
            rgba(30, 70, 120, 0.05);
        }

        .sectionHeader {
          display: grid;
          grid-template-columns:
            42px 1fr;

          gap: 13px;

          padding-bottom: 21px;

          border-bottom:
            1px solid #e7edf4;
        }

        .sectionNumber {
          width: 38px;
          height: 38px;

          display: grid;
          place-items: center;

          border-radius: 10px;

          background: #edf4ff;
          color: #1266e9;

          font-size: 10px;
          font-weight: 950;
        }

        .sectionHeader span {
          color: #1266e9;

          font-size: 8px;
          font-weight: 900;

          letter-spacing: 1.3px;
        }

        .sectionHeader h3 {
          margin: 5px 0 0;

          color: #223951;

          font-size: 18px;
        }

        .sectionHeader p {
          max-width: 590px;

          margin: 7px 0 0;

          color: #7c8998;

          font-size: 9px;
          line-height: 1.55;
        }

        .adminToggleRow {
          margin-top: 22px;

          min-height: 76px;

          padding: 15px 16px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 20px;

          border: 1px solid #d8e4f2;
          border-radius: 12px;

          background: #f9fbfe;
        }

        .adminToggleRow strong {
          display: block;

          color: #304861;

          font-size: 10px;
        }

        .adminToggleRow p {
          margin: 4px 0 0;

          color: #8492a2;

          font-size: 8px;
          line-height: 1.5;
        }

        .toggle {
          width: 48px;
          height: 27px;

          flex: 0 0 48px;

          padding: 3px;

          border: 0;
          border-radius: 999px;

          background: #dce4ed;

          cursor: pointer;
        }

        .toggle span {
          width: 21px;
          height: 21px;

          display: block;

          border-radius: 50%;

          background: #ffffff;

          box-shadow:
            0 2px 5px
            rgba(30, 50, 80, 0.18);

          transition:
            transform 0.2s ease;
        }

        .toggle.active {
          background: #1266e9;
        }

        .toggle.active span {
          transform:
            translateX(21px);
        }

        .adminArea {
          margin-top: 18px;
        }

        .field label {
          display: block;

          margin-bottom: 7px;

          color: #344a62;

          font-size: 10px;
          font-weight: 850;
        }

        .field label span {
          margin-left: 3px;

          color: #1266e9;
        }

        .field input {
          width: 100%;
          min-height: 50px;

          padding: 0 14px;

          border:
            1px solid #d5e0eb;

          border-radius: 11px;

          outline: none;

          background: #ffffff;

          color: #1f344b;

          font-family: inherit;
          font-size: 12px;
        }

        .field input:focus {
          border-color: #1266e9;

          box-shadow:
            0 0 0 4px
            rgba(18,102,233,.08);
        }

        .field small {
          display: block;

          margin-top: 6px;

          color: #909dab;

          font-size: 8px;
          line-height: 1.45;
        }

        .permissionsHeader {
          margin-top: 26px;
        }

        .permissionsHeader > span {
          color: #1266e9;

          font-size: 8px;
          font-weight: 900;

          letter-spacing: 1.2px;
        }

        .permissionsHeader h4 {
          margin: 5px 0 0;

          color: #2c435c;

          font-size: 14px;
        }

        .permissionsHeader p {
          margin: 6px 0 0;

          color: #8491a0;

          font-size: 8px;
          line-height: 1.5;
        }

        .permissionList {
          margin-top: 14px;

          border-top:
            1px solid #e2e9f1;
        }

        .lockedPermissions {
          margin-top: 21px;

          padding: 14px;

          display: flex;
          align-items: flex-start;

          gap: 10px;

          border:
            1px solid #efd8da;

          border-radius: 12px;

          background: #fff9f9;
        }

        .lockIcon {
          width: 25px;
          height: 25px;

          flex: 0 0 25px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          background: #fbe8e9;
          color: #b94b54;

          font-size: 11px;
          font-weight: 950;
        }

        .lockedPermissions strong {
          display: block;

          color: #70464b;

          font-size: 9px;
        }

        .lockedGrid {
          margin-top: 9px;

          display: flex;
          flex-wrap: wrap;

          gap: 6px;
        }

        .lockedGrid span {
          padding: 5px 7px;

          border-radius: 7px;

          background: #ffffff;

          color: #9a656a;

          font-size: 7px;

          border:
            1px solid #f0dcde;
        }

        @media (max-width: 600px) {
          .sectionCard {
            padding: 19px;
          }

          .field input {
            font-size: 16px;
          }
        }
      `}</style>
    </>
  );
}

function PermissionRow({
  label,
  text,
  checked,
  onClick,
}: {
  label: string;
  text: string;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <>
      <div className="permissionRow">
        <div>
          <strong>
            {label}
          </strong>

          <p>
            {text}
          </p>
        </div>

        <button
          type="button"
          className={
            checked
              ? "miniToggle active"
              : "miniToggle"
          }
          onClick={onClick}
          aria-pressed={checked}
        >
          <span />
        </button>
      </div>

      <style jsx>{`
        .permissionRow {
          min-height: 66px;

          padding: 12px 3px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 18px;

          border-bottom:
            1px solid #e2e9f1;
        }

        .permissionRow strong {
          display: block;

          color: #344b64;

          font-size: 10px;
        }

        .permissionRow p {
          max-width: 520px;

          margin: 4px 0 0;

          color: #8996a5;

          font-size: 8px;
          line-height: 1.5;
        }

        .miniToggle {
          width: 44px;
          height: 25px;

          flex: 0 0 44px;

          padding: 3px;

          border: 0;
          border-radius: 999px;

          background: #dce4ed;

          cursor: pointer;
        }

        .miniToggle span {
          width: 19px;
          height: 19px;

          display: block;

          border-radius: 50%;

          background: #ffffff;

          box-shadow:
            0 2px 5px
            rgba(30, 50, 80, 0.18);

          transition:
            transform 0.2s ease;
        }

        .miniToggle.active {
          background: #1266e9;
        }

        .miniToggle.active span {
          transform:
            translateX(19px);
        }
      `}</style>
    </>
  );
}

export type {
  AdminPermissions,
};
