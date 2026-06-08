import { Layout } from "./Layout";

interface PageTemplateProps {
  title: string;
  description?: string;
}

export const PageTemplate = ({ title, description }: PageTemplateProps) => {
  return (
    <Layout>
      <div className="section-padding">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">{title}</h1>

            <p className="text-lg text-muted-foreground">
              {description || `This is the ${title} page for Sniper Systems & Solutions. A detailed version of this page is coming soon.`}
            </p>

          </div>
        </div>
      </div>
    </Layout>
  );
};
