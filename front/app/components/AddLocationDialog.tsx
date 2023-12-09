import { possibleThemes, useAuthContext } from "@/context/AuthContext";
import { alertFailure, alertSuccess } from "@/utils/notify";
import { apiPOST } from "@/utils/requestWrapper";
import { Dialog, RadioGroup, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";

interface IAddLocationDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AddLocationDialog = (props: IAddLocationDialogProps) => {
  const { open, setOpen } = props;
  const { t, i18n } = useTranslation();
  const { user, theme, updateLocationsCallback } = useAuthContext();
  const [locationName, setLocationName] = useState("");

  const handleForm = async (event: any) => {
    event.preventDefault();
    apiPOST("/location/add", {
      name: locationName,
      fb_id: user?.uid,
    })
      .then((res) => {
        updateLocationsCallback();
        alertSuccess(t("locationAdded"));
        setOpen(false);
      })
      .catch((err) => {
        console.log(err);
        alertFailure(t("somethingWentWrong"));
      });
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
                    {t("addLocation")}
                  </Dialog.Title>
                  <form>
                    <div className="mx-auto w-full mt-4">
                      <div className="flex flex-col">
                        <label
                          htmlFor="locationName"
                          className={`text-md font-medium text-${theme}-100`}>
                          {t("location")}
                        </label>
                        <input
                          value={locationName}
                          onChange={(e) => setLocationName(e.target.value)}
                          type="text"
                          name="locationName"
                          id="locationName"
                          className={`mt-2 p-1 block w-full border-${theme}-300 rounded-md bg-${theme}-500 text-${theme}-100 focus:outline-none`}
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        type="submit"
                        onClick={handleForm}
                        className={`mr-2 inline-flex justify-center rounded-lg p-2 text-${theme}-100 bg-${theme}-500 hover:bg-${theme}-700`}>
                        {t("addLocation")}
                      </button>
                      <button
                        type="button"
                        className={`inline-flex justify-center rounded-lg p-2 text-${theme}-700 bg-${theme}-300 hover:bg-${theme}-500`}
                        onClick={() => setOpen(false)}>
                        {t("closeModal")}
                      </button>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
export default AddLocationDialog;
