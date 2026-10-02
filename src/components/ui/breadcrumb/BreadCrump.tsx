import React, { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from ".";
import { RenderWithSkeleton } from "../../helpers/renderWirthSkeleton";

type BreadcrumbItemType = {
  id: string;
  label: string | null;
  Link?: string;
};

type BreadCrumpProps = {
  List: BreadcrumbItemType[];
};

const BreadCrump = ({ List }: BreadCrumpProps) => {
  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          {List?.map((item, index) => (
            <Fragment key={item.id}>
              <RenderWithSkeleton value={item.label}>
                <>
                  <BreadcrumbItem>
                    {item.Link ? (
                      <BreadcrumbLink
                        href={item.Link}
                        className="font-medium text-muted-foreground"
                      >
                        {item.label}
                      </BreadcrumbLink>
                    ) : (
                      <span className="cursor-default font-medium text-foreground">
                        {item.label}
                      </span>
                    )}
                  </BreadcrumbItem>
                  {index !== List.length - 1 && <BreadcrumbSeparator />}
                </>
              </RenderWithSkeleton>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default BreadCrump;

// usage
// <BreadCrump List={breadCrump} />
