import { ProductType } from "@/lib/types";
import { FC } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  products: ProductType[];
  title?: string;
  link?: string;
  arrow?: boolean;
}

const ProductList: FC<Props> = ({ products, title, link, arrow }) => {
  const Title = () => {
    if (link) {
      <link href={link} className="h-12">
        <h2 className="text-main-primary text-xl font-bold">
          {title} &nbsp;{" "}
          {arrow ? <ChevronRight className="w-3 inline-block" /> : ""}
        </h2>
      </link>;
    } else {
      return (
        <h2 className="text-main-primary text-xl font-bold">
          {title}&nbsp;
          {arrow && <ChevronRight className="w-3 inline-block" />}
        </h2>
      );
    }
  };

  return (
    <div className="relative">
      {title && <Title />}
      {products.length > 0 ? (
        <div
          className={cn(
            "flex flex-wrap -translate-x-5 w-[calc(100%+3rem)] sm:w-[calc(100%+1.5rem)]",
            { "mt-2": title }
          )}
        >
          {products.map((product) => (
            <h1 key={product.id}>{product.name}</h1>
          ))}
        </div>
      ) : (
        <p>No products</p>
      )}
    </div>
  );
};

export default ProductList;
