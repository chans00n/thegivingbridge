"use client";

interface CampaignStoryProps {
  story: string;
  title?: string;
}

export const CampaignStory: React.FC<CampaignStoryProps> = ({
  story,
  title,
}) => {
  return (
    <div className="py-6 bg-white shadow-md rounded-lg dark:bg-neutral-800">
      <div className="px-6">
        {title && (
          <h2 className="mb-4 text-2xl font-semibold leading-tight text-neutral-900 dark:text-white">
            {title}
          </h2>
        )}
        {/* For rendering plain text. If story were HTML, would need different handling. */}
        <div className="prose prose-slate max-w-none dark:prose-invert lg:prose-lg xl:prose-xl">
          {(story || "").split("\n").map((paragraph, index) => (
            <p key={index} className={index > 0 ? "mt-4" : ""}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
