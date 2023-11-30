import { useAuthContext } from "@/context/AuthContext";
import {
  faTrash,
  faArrowUp,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import CircleButtonComponent from "../CircleButtonComponent";

interface IMoveCardComponentProps {
  editing: boolean;
  index: number;
  enabledCards: { component: number; data: number | null }[];
  setEnabledCards: (
    cards: { component: number; data: number | null }[]
  ) => void;
}

const MoveCardComponent = (props: IMoveCardComponentProps) => {
  const { theme } = useAuthContext();
  const { editing, index, enabledCards, setEnabledCards } = props;

  const handleMove = (index: number, direction: "up" | "down") => {
    const newData = [...enabledCards];
    const temp = newData[index];
    if (direction === "up") {
      newData[index] = newData[index - 1];
      newData[index - 1] = temp;
    } else {
      newData[index] = newData[index + 1];
      newData[index + 1] = temp;
    }
    setEnabledCards(newData);
  };

  const handleDelete = (index: number) => {
    const newData = [...enabledCards];
    newData.splice(index, 1);
    setEnabledCards(newData);
  };

  if (editing)
    return (
      <div className="ml-4 flex flex-row items-center">
        <div>
          <CircleButtonComponent
            className={`bg-${theme}-500 m-1 p-2 rounded-xl ${
              index === 0 && "disabled"
            }`}
            iconClassName={`text-sm text-${theme}-100`}
            icon={faArrowUp}
            onClick={() => handleMove(index, "up")}
            disabled={index === 0}
          />
          <CircleButtonComponent
            className={`bg-${theme}-500 m-1 p-2 rounded-xl`}
            iconClassName={`text-sm text-${theme}-100`}
            icon={faArrowDown}
            onClick={() => handleMove(index, "down")}
            disabled={index === enabledCards.length - 1}
          />
        </div>
        <CircleButtonComponent
          className={`bg-${theme}-500 m-1 p-2 h-12 rounded-xl`}
          iconClassName={`text-sm text-${theme}-100`}
          icon={faTrash}
          onClick={() => handleDelete(index)}
        />
      </div>
    );
  else return <div className="w-16 h-8" />;
};

export default MoveCardComponent;
