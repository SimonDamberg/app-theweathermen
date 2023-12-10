import { possibleThemes, useAuthContext } from "@/context/AuthContext";
import { apiPOST } from "@/utils/requestWrapper";
import { Dialog, RadioGroup, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";

interface IColourSelectorComponentProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const opacities = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
  "950",
];

export default function ColourSelector(props: IColourSelectorComponentProps) {
  const { open, setOpen } = props;
  const { t, i18n } = useTranslation();

  const { user, theme, setTheme } = useAuthContext();

  const saveNewTheme = (newTheme: string) => {
    apiPOST(`/user/theme`, { theme: newTheme, fb_id: user?.uid }).then(
      (res) => {
        console.log(res);
        setTheme(newTheme);
      }
    );
  };

  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 flex mx-20 items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">
              <Dialog.Panel>
                <div
                  className={`w-fit transform rounded-2xl bg-${theme}-900 p-6 text-left align-middle shadow-xl transition-all`}>
                  <Dialog.Title
                    as="h3"
                    className={`text-xl font-medium leading-6 text-${theme}-100`}>
                    {t("colourSelector")}
                  </Dialog.Title>
                  <div className="mx-auto w-full mt-4">
                    <RadioGroup value={theme} onChange={saveNewTheme}>
                      <div className="grid grid-cols-3 auto-rows-min gap-4">
                        {possibleThemes.map((ind) => (
                          <RadioGroup.Option
                            key={ind}
                            value={ind}
                            className={({ checked }) =>
                              `flex cursor-pointer rounded-lg p-4 w-fit shadow-lg hover:opacity-70 transition-all ease-in-out duration-300 ${
                                checked ? `bg-${theme}-500` : `bg-${theme}-700`
                              } `
                            }>
                            <div className="flex w-auto items-center justify-between">
                              <div className="text-sm ">
                                <RadioGroup.Label
                                  as="p"
                                  className={`font-medium text-${theme}-100`}>
                                  {ind[0].toUpperCase() + ind.slice(1)}
                                </RadioGroup.Label>
                                <RadioGroup.Description as="span">
                                  {opacities.map((op, idx) => (
                                    <span
                                      key={idx}
                                      className={`bg-${ind}-${op} w-4 mr-2 mt-1 h-4 rounded-full inline-block`}
                                    />
                                  ))}
                                </RadioGroup.Description>
                              </div>
                            </div>
                          </RadioGroup.Option>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      className={`inline-flex justify-center rounded-md border border-transparent bg-${theme}-500 px-4 py-2 text-sm font-medium text-${theme}-100 hover:bg-${theme}-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-${theme}-500 focus-visible:ring-offset-2`}
                      onClick={() => setOpen(false)}>
                      {t("closeModal")}
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
