import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { componentTypes, dataTypes } from "../LocationCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";

interface IListBoxSelectComponentProps {
  rowIdx: number;
  colour: string;
  setEnabledCards: (
    cards: { component: number; data: number | null }[]
  ) => void;
  enabledCards: { component: number; data: number | null }[];
  isData: boolean;
}

export default function SelectComp(props: IListBoxSelectComponentProps) {
  const { colour, rowIdx, setEnabledCards, isData, enabledCards } = props;
  const data = isData ? dataTypes : componentTypes;
  const row = enabledCards[rowIdx];
  const idx = isData ? row.data : row.component;
  if (idx === null) {
    return null;
  }
  const selected = data[idx];

  const handleChanges = (newIndex: number) => {
    const newData = [...enabledCards];
    if (isData) {
      newData[rowIdx].data = newIndex;
    } else {
      if (newIndex === 2) {
        newData[rowIdx].data = null;
      } else if (newData[rowIdx].data === null) {
        newData[rowIdx].data = 0;
      }
      newData[rowIdx].component = newIndex;
    }
    setEnabledCards(newData);
  };

  return (
    <Listbox
      value={data[idx]}
      onChange={(newIndex) => handleChanges(newIndex.id)}>
      <div className="relative">
        <Listbox.Button
          className={`cursor-pointer rounded-lg bg-${colour}-500 py-2 pl-3 pr-10 shadow-md sm:text-sm`}>
          <span className=" text-sky-100">{selected.name}</span>
          <span className="absolute inset-y-0 right-0 flex flex-col justify-center pr-2">
            <FontAwesomeIcon icon={faChevronUp} className="h-3 text-sky-100" />
            <FontAwesomeIcon
              icon={faChevronDown}
              className="h-3 text-sky-100"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <Listbox.Options
            className={`z-10 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-${colour}-500 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm`}>
            {data.map((singleData: { name: string; id: number }) => (
              <Listbox.Option
                key={singleData.id}
                className={`relative cursor-pointer select-none py-2 pl-10 pr-4 
                    bg-${colour}-500 text-sky-100 hover:bg-${colour}-300 hover:text-${colour}-800
                  `}
                value={singleData}>
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}>
                      {singleData.name}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sky-100">
                        <FontAwesomeIcon icon={faCheck} className="h-4 " />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
