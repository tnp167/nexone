import { cn } from "@/lib/utils";

interface Spec {
  name: string;
  value: string;
}

interface Props {
  specs: {
    product?: Spec[];
    variant: Spec[];
  };
}

const ProductSpecs = ({ specs }: Props) => {
  const { product, variant } = specs;
  return (
    <div className="scroll-pt-16">
      <div className="h-12">
        <h2 className="text-main-primary text-2xl font-bold">Specifications</h2>
      </div>
      {/* Product Specs Table */}
      <SpecTable data={product || []} />
      {/* Variant Specs Table */}
      <SpecTable data={variant} noTopBorder />
    </div>
  );
};

export default ProductSpecs;

const SpecTable = ({
  data,
  noTopBorder,
}: {
  data: Spec[];
  noTopBorder?: boolean;
}) => {
  return (
    <ul
      className={cn("border grid grid-cols-2", {
        "border-t-0": noTopBorder,
      })}
    >
      {data.map((spec, idx) => (
        <li
          key={idx}
          className={cn(
            "flex border-t border-main-primary/20 pr-4 items-center",
            {
              "border-t-0": noTopBorder || idx === 0,
            }
          )}
        >
          <div className="float-left text-sm leading-7 max-w-[50%] w-1/2 relative flex">
            <div className="p-4 bg-[#f5f5f5] text-main-primary w-44">
              <span className="leading-5">{spec.name}</span>
            </div>
            <div className="p-4 leading-5 text-[#151515] flex-1 break-words w-44">
              <span className="leading-5">{spec.value}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};
