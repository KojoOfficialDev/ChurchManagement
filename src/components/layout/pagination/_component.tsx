import React, { useEffect, useState } from "react";

interface Props {
  data: any;
  RenderComponent: any;
  pageLimit: any;
  dataLimit: any;
  componentProps?: { (index: number): void };
}

const Paginate: React.FC<Props> = ({
  data,
  RenderComponent,
  pageLimit,
  dataLimit,
  componentProps,
}) => {
  const [pages] = useState(Math.round(data.length / dataLimit));
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationGroup, setPaginationGroup] = useState<number[]>([]);

  useEffect(() => {
    if (!paginationGroup.length) {
      getPaginationGroup(currentPage);
    }
  });

  function hasMore() {
    let lastItem = paginationGroup[pageLimit - 1];
    let lastDataItem = Math.round(data.length / dataLimit);
    return lastItem < lastDataItem;
  }

  function moreNext() {
    getPaginationGroup(paginationGroup[paginationGroup.length - 1] + 1);
  }

  function morePrev() {
    getPaginationGroup(paginationGroup[0] - pageLimit);
  }

  function goToNextPage() {
    setCurrentPage((page) => page + 1);
    getPaginationGroup(currentPage + 1);
  }

  function goToPreviousPage() {
    setCurrentPage((page) => page - 1);
    getPaginationGroup(currentPage - 1);
  }

  function changePage(event: { target: { textContent: any } }) {
    const pageNumber = Number(event.target.textContent);
    setCurrentPage(pageNumber);
  }

  const getPaginatedData = () => {
    const startIndex = currentPage * dataLimit - dataLimit;
    const endIndex = startIndex + dataLimit;
    return data.slice(startIndex, endIndex);
  };

  const getPaginationGroup = (groupCurrentPage: number) => {
    let start = Math.floor((groupCurrentPage - 1) / pageLimit) * pageLimit;
    if (data.length <= pageLimit) {
      pageLimit = 1;
    }
    let group = new Array(pageLimit).fill(0).map((_, idx) => start + idx + 1);
    setPaginationGroup(group);
  };

  return (
    <>
      <RenderComponent
        data={getPaginatedData()}
      /* onItemClick={(e: any) => {
        componentProps(e);
      }} */
      />

      <div className="pagination">
        <nav className="text-center">
          {currentPage > 1 && (
            <button
              disabled={currentPage === 1}
              onClick={goToPreviousPage}
              className="pagination-btn prev"
            >
              <span>
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </span>
            </button>
          )}

          {paginationGroup[0] !== 1 && (
            <button
              onClick={morePrev}
              className="pagination-btn pagination-more"
            >
              <span>...</span>
            </button>
          )}
          {currentPage > 1 &&
            paginationGroup.map((item, index) => (
              <button
                key={index}
                onClick={(e) => changePage}
                className={
                  currentPage === item
                    ? "pagination-btn active"
                    : "pagination-btn"
                }
              >
                <span>{item}</span>
              </button>
            ))}
          {hasMore() && (
            <button
              onClick={moreNext}
              className="pagination-btn pagination-more"
            >
              <span>...</span>
            </button>
          )}
          {currentPage > 1 && (
            <button
              onClick={goToNextPage}
              className="pagination-btn next"
              disabled={currentPage === pages}
            >
              <span>
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </span>
            </button>
          )}
        </nav>
      </div>
    </>
  );
};

export default Paginate;
