"use client";

type Language = "ka" | "en";

export type TeamMember = {
  id: string;
  name: string;
  roleKa: string;
  roleEn: string;
  bioKa?: string;
  bioEn?: string;
  image?: string;
  linkedin?: string;
};

type Props = {
  language?: Language;
  titleKa?: string;
  titleEn?: string;
  descriptionKa?: string;
  descriptionEn?: string;
  members?: TeamMember[];
};

const defaultMembers: TeamMember[] = [];

export default function TeamSection({
  language = "ka",

  titleKa = "ჩვენი გუნდი",
  titleEn = "Our Team",

  descriptionKa =
    "QR RETURN-ის გუნდი ქმნის სისტემას, რომელიც ადამიანებს ეხმარება დაკარგული ნივთების, შინაური ცხოველებისა და მნიშვნელოვანი ინფორმაციის სწრაფად დაკავშირებაში.",

  descriptionEn =
    "The QR RETURN team is building a system designed to help people reconnect with lost belongings, pets, and important information.",

  members = defaultMembers,
}: Props) {
  const ka = language === "ka";

  return (
    <section
      id="team"
      className="teamSection"
    >
      <div className="shell">
        <div className="heading">
          <span>
            QR RETURN PEOPLE
          </span>

          <h2>
            {ka ? titleKa : titleEn}
          </h2>

          <p>
            {ka
              ? descriptionKa
              : descriptionEn}
          </p>
        </div>

        {members.length > 0 ? (
          <div className="grid">
            {members.map((member) => (
              <TeamCard
                key={member.id}
                member={member}
                language={language}
              />
            ))}
          </div>
        ) : (
          <div className="empty">
            <div className="emptyIcon">
              <TeamIcon />
            </div>

            <div>
              <strong>
                {ka
                  ? "გუნდის პროფილები მოგვიანებით დაემატება"
                  : "Team profiles will be added later"}
              </strong>

              <p>
                {ka
                  ? "ფოტოები, სახელები და პოზიციები შეგიძლიათ მაშინ დაამატოთ, როცა მზად იქნებით."
                  : "Photos, names, and roles can be added when you are ready."}
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .teamSection {
          width: 100%;
          padding: 90px 0;

          background: #ffffff;
        }

        .shell {
          width:
            calc(100% - 56px);

          max-width: 1180px;

          margin: 0 auto;
        }

        .heading {
          max-width: 720px;
        }

        .heading > span {
          color: #c84a50;

          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        h2 {
          margin: 10px 0 0;

          color: #202b37;

          font-size:
            clamp(
              35px,
              4vw,
              46px
            );

          font-weight: 680;
          line-height: 1.06;
          letter-spacing: -2px;
        }

        .heading p {
          max-width: 650px;

          margin: 15px 0 0;

          color: #737e89;

          font-size: 11px;
          line-height: 1.72;
        }

        .grid {
          margin-top: 42px;

          display: grid;
          grid-template-columns:
            repeat(
              3,
              minmax(0, 1fr)
            );

          gap: 18px;
        }

        .empty {
          margin-top: 42px;

          min-height: 130px;

          padding: 22px;

          display: flex;
          align-items: center;

          gap: 16px;

          border:
            1px solid #e1e5e8;

          border-radius: 16px;

          background: #f8f9f8;
        }

        .emptyIcon {
          width: 48px;
          height: 48px;

          display: grid;
          place-items: center;

          flex: 0 0 48px;

          border-radius: 13px;

          color: #c84a50;
          background: #fff0f0;
        }

        .emptyIcon
          :global(svg) {
          width: 21px;
          height: 21px;
        }

        .empty strong {
          display: block;

          color: #34404b;

          font-size: 11px;
        }

        .empty p {
          margin: 5px 0 0;

          color: #8a939c;

          font-size: 9px;
          line-height: 1.6;
        }

        @media (
          max-width: 900px
        ) {
          .grid {
            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );
          }
        }

        @media (
          max-width: 650px
        ) {
          .teamSection {
            padding: 65px 0;
          }

          .shell {
            width:
              calc(100% - 28px);
          }

          .grid {
            grid-template-columns:
              1fr;
          }
        }
      `}</style>
    </section>
  );
}

function TeamCard({
  member,
  language,
}: {
  member: TeamMember;
  language: Language;
}) {
  const ka = language === "ka";

  return (
    <article className="card">
      <div className="image">
        {member.image ? (
          <img
            src={member.image}
            alt={member.name}
          />
        ) : (
          <div className="placeholder">
            <PersonIcon />
          </div>
        )}
      </div>

      <div className="content">
        <span className="role">
          {ka
            ? member.roleKa
            : member.roleEn}
        </span>

        <strong>
          {member.name}
        </strong>

        {(member.bioKa ||
          member.bioEn) && (
          <p>
            {ka
              ? member.bioKa
              : member.bioEn}
          </p>
        )}

        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn ↗
          </a>
        )}
      </div>

      <style jsx>{`
        .card {
          overflow: hidden;

          border:
            1px solid #e0e4e7;

          border-radius: 17px;

          background: #ffffff;

          box-shadow:
            0 12px 30px
            rgba(
              32,
              43,
              55,
              0.035
            );
        }

        .image {
          height: 240px;

          overflow: hidden;

          background:
            linear-gradient(
              145deg,
              #eef1f3,
              #fafaf9
            );
        }

        .image img {
          width: 100%;
          height: 100%;

          object-fit: cover;
        }

        .placeholder {
          width: 100%;
          height: 100%;

          display: grid;
          place-items: center;

          color: #a8b0b8;
        }

        .placeholder
          :global(svg) {
          width: 52px;
          height: 52px;
        }

        .content {
          padding: 18px;
        }

        .role {
          color: #c84a50;

          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.7px;
        }

        strong {
          display: block;

          margin-top: 7px;

          color: #28343f;

          font-size: 14px;
          font-weight: 800;
        }

        p {
          margin: 9px 0 0;

          color: #79838d;

          font-size: 9px;
          line-height: 1.65;
        }

        a {
          display: inline-block;

          margin-top: 14px;

          color: #225fc7;

          font-size: 8px;
          font-weight: 800;

          text-decoration: none;
        }
      `}</style>
    </article>
  );
}

function TeamIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <circle
        cx="9"
        cy="8"
        r="3"
      />

      <circle
        cx="17"
        cy="9"
        r="2.4"
      />

      <path d="M3.5 20c.5-4 2.6-6 5.5-6s5 2 5.5 6" />

      <path d="M14.5 15c2.9.2 4.7 1.8 5 5" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle
        cx="12"
        cy="8"
        r="4"
      />

      <path d="M4.5 21c.8-4.1 3.3-6.3 7.5-6.3s6.7 2.2 7.5 6.3" />
    </svg>
  );
}
