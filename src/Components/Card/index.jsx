import "./index.scss";

const Card = ({ imgLink, title }) => {
  const truncateTitle = () => {
    return title.length > 30 ? title.slice(30) + "..." : title;
  };
  return (
    <div className="card">
      <div className="image">
        <img src={imgLink} alt={title} />
      </div>
      <div className="title">
        <p>{truncateTitle()}</p>
      </div>
    </div>
  );
};
export default Card;
