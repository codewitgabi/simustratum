import type { SessionUser } from "@/lib/auth";
import SettingsHeader from "./SettingsHeader";
import ProfileCard from "./ProfileCard";
import PasswordCard from "./PasswordCard";
import PlanCard from "./PlanCard";

type SettingsContentProps = {
  user: SessionUser;
};

function SettingsContent({ user }: SettingsContentProps) {
  return (
    <div className="flex min-h-screen min-w-0 flex-1 flex-col overflow-x-clip">
      <SettingsHeader user={user} />

      <div className="step-animate px-4 pt-5 pb-8 sm:px-6 sm:pt-7 sm:pb-10 lg:px-8">
        <div className="mb-5 sm:mb-7">
          <h2 className="mb-1 font-grotesk text-[1.25rem] font-bold tracking-[-0.5px] text-ink sm:text-[1.5rem]">
            Account settings
          </h2>
          <p className="text-[0.9rem] text-mid">
            Manage your profile, password, and account.
          </p>
        </div>

        <div className="flex max-w-2xl flex-col gap-6">
          <PlanCard />
          <ProfileCard user={user} />
          <PasswordCard user={user} />
        </div>
      </div>
    </div>
  );
}

export default SettingsContent;
