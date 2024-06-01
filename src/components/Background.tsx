import background from "@/app/assets/background.jpg";
function Background() {
  const squares = [
    {
      id: 0,
      style: { width: "200px", height: "200px", top: "25px", right: "5px" },
    },
    {
      id: 1,
      style: {
        width: "220px",
        height: "220px",
        top: "555px",
        left: "26px",
        zIndex: 2,
      },
    },
    {
      id: 2,
      style: {
        width: "140px",
        height: "140px",
        bottom: "20px",
        right: "85px",
        zIndex: 2,
      },
    },
    {
      id: 3,
      style: { width: "90px", height: "90px", bottom: "405px", left: "15px" },
    },
    {
      id: 4,
      style: { width: "150px", height: "150px", top: "55px", left: "25px" },
    },
    {
      id: 5,
      style: {
        width: "85px",
        height: "85px",
        top: "425px",
        right: "155px",
        zIndex: 2,
      },
    },
  ];
  return (
    <>
      <div
        className="fixed h-screen w-screen top-0 left-0 bg-cover bg-center overflow-hidden z-[-2]"
        style={{ backgroundImage: `url(${background.src})` }}
      >
        {squares.map((square) => (
          <div
            key={square.id}
            className="square"
            style={{
              ...square.style,
              animationDelay: `calc(-1s * ${square.id})`,
            }}
          ></div>
        ))}
      </div>
    </>
  );
}

export default Background;
