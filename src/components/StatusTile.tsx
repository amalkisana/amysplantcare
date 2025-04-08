interface StatusTileProps {
  name: string;
  value: string;
}

export default function StatusTile({
  name: measurementName,
  value,
}: StatusTileProps) {
  return (
    <div className="border-[5px] border-[#3b522f] rounded-md px-8 pt-2 pb-4 bg-[#ffffffcc] text-center flex-shrink">
      <h2 className="mt-0 mb-2 text-[#3b522f] text-[1rem]  md:text-[2rem]">{`${measurementName} Status`}</h2>
      <p className="text-[#3b522f] text-[1.5rem]  md:text-[3rem] font-bold m-0">{value}</p>
    </div>
  );
}