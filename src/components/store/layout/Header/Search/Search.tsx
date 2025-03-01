import { SearchIcon } from "@/components/store/icons";

const Search = () => {
  return (
    <div className="relative lg:w-full flex-1">
      <form className="h-10 rounded-3xl bg-white relative border-none flex">
        <input
          type="text"
          placeholder="Search..."
          className="bg-white text-black flex-1 border-none pl-2.5 m-2.5 outline-none"
        />
        <button
          type="submit"
          className=" rounded-[20px] w-[56px] h-8 mt-1 mr-1 mb-0 ml-0 bg-gradient-to-r from-slate-500 to-slate-500 grid place-items-center cursor-pointer"
        >
          <SearchIcon />
        </button>
      </form>
    </div>
  );
};

export default Search;
