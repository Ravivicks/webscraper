import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Image from "next/image";
import SearchBar from "./SearchBar";
import SearchBarEbay from "./SearchBarEbay";

export default function Tabs() {
  return (
    <div className="flex w-full justify-start pt-10">
      <div className="w-full">
        <TabGroup>
          <TabList className="flex gap-4 p-4 rounded-full">
            <Tab className="rounded-full py-1 px-3 text-sm/6 font-semibold text-black focus:outline-none data-[selected]:bg-primary/10 data-[hover]:bg-primary/10 data-[selected]:data-[hover]:bg-primary/10 data-[focus]:outline-1 data-[focus]:outline-white">
              <Image
                src="/assets/icons/amazon.png"
                alt="bag"
                width={100}
                height={30}
                className="p-3"
              />
            </Tab>
            <Tab className="rounded-full py-1 px-3 text-sm/6 font-semibold text-black focus:outline-none data-[selected]:bg-primary/10 data-[hover]:bg-primary/10 data-[selected]:data-[hover]:bg-primary/10 data-[focus]:outline-1 data-[focus]:outline-white">
              <Image
                src="/assets/icons/ebay.png"
                alt="bag"
                width={100}
                height={30}
                className="p-3"
              />
            </Tab>
          </TabList>
          <TabPanels className="mt-3">
            <TabPanel className="rounded-xl bg-white/5 p-3">
              <SearchBar />
            </TabPanel>
          </TabPanels>
          <TabPanels className="mt-3">
            <TabPanel className="rounded-xl bg-white/5 p-3">
              <SearchBarEbay />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
}
