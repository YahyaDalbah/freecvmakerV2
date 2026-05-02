import { memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";

type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

function AutoSaveIndicator({ status }: { status: AutoSaveStatus }) {
  return (
    <div
      className={`fixed left-1/2 -translate-x-1/2 z-40 transition-all duration-300 ease-out ${
        status === 'idle' ? 'bottom-0 opacity-0' : 'bottom-6 opacity-100'
      }`}
    >
      <div className={`px-4 py-2 rounded-full shadow-lg flex items-center gap-2 ${
        status === 'error' ? 'bg-red-600 text-white' : 'bg-black text-white'
      }`}>
        {status === 'saving' && (
          <>
            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
            <span className="text-sm font-medium">Saving...</span>
          </>
        )}
        {status === 'saved' && (
          <>
            <FontAwesomeIcon icon={faCircleCheck} className="text-green-400" />
            <span className="text-sm font-medium">Saved</span>
          </>
        )}
        {status === 'error' && (
          <>
            <FontAwesomeIcon icon={faCircleXmark} className="text-white" />
            <span className="text-sm font-medium">Something went wrong</span>
          </>
        )}
      </div>
    </div>
  );
}

export default memo(AutoSaveIndicator);

