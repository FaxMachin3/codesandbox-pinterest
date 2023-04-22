import { useEffect, useState, useRef, useCallback } from "react";
import "./styles.css";

const LIMIT = 15;

const useFetchPic = (page) => {
  const [isLoading, setIsLoading] = useState(false);
  const [pics, setPics] = useState([]);
  const fetchedFor = useRef(-1);

  useEffect(() => {
    // hack for double useEffect call in strict mode
    if (page > fetchedFor.current) {
      fetchedFor.current = page;
      setIsLoading(true);
      fetch(`https://picsum.photos/v2/list?page=${page}&limit=${LIMIT}`)
        .then((res) => res.json())
        .then((data) => {
          setIsLoading(false);
          setPics((prevPics) => [...prevPics, ...data]);
        })
        .catch((err) => {
          console.log({ err });
          setIsLoading(false);
          setPics([]);
        });
    }
  }, [page]);

  return [pics, isLoading];
};

export default function App() {
  const [page, setPage] = useState(1);
  const [pics, isLoading] = useFetchPic(page);
  const observer = useRef(null);
  const lastImageCallback = useCallback((node) => {
    if (!node) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log("node");
          setPage((prevPage) => prevPage + 1);
        }
      });
    });

    observer.current.observe(node);
  }, []);

  console.log({ pics });

  // TODO : add virtualization
  return (
    <>
      <div className="pics-container">
        {pics.map(({ id, download_url, author }, index) => {
          const spanClass = `span-${Math.floor(Math.random() * 2) + 2}`;
          const lastImage = index === pics.length - 1;

          return lastImage ? (
            <div
              ref={lastImageCallback}
              className={`image-card ${index % 2 !== 0 ? spanClass : ""}`}
              key={id}
            >
              <img src={download_url} alt={author} loading="lazy" />
            </div>
          ) : (
            <div
              className={`image-card ${index % 2 !== 0 ? spanClass : ""}`}
              key={id}
            >
              <img src={download_url} alt={author} loading="lazy" />
            </div>
          );
        })}
      </div>
      {isLoading && (
        <div className="loader">
          <svg
            version="1.1"
            id="L6"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 100 100"
            enableBackground="new 0 0 100 100"
            xmlSpace="preserve"
          >
            <rect
              fill="none"
              stroke="#fff"
              strokeWidth="4"
              x="25"
              y="25"
              width="50"
              height="50"
            >
              <animateTransform
                attributeName="transform"
                dur="0.5s"
                from="0 50 50"
                to="180 50 50"
                type="rotate"
                id="strokeBox"
                attributeType="XML"
                begin="rectBox.end"
              />
            </rect>
            <rect x="27" y="27" fill="#fff" width="46" height="50">
              <animate
                attributeName="height"
                dur="1.3s"
                attributeType="XML"
                from="50"
                to="0"
                id="rectBox"
                fill="freeze"
                begin="0s;strokeBox.end"
              />
            </rect>
          </svg>
        </div>
      )}
      <div></div>
    </>
  );
}
