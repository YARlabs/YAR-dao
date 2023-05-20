import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { useActions } from "../../hooks/useActions";

const HistoryPagination = () => {
    const {historyVotings} = useTypedSelector(state => state.main);
    const {SetCurrentHistoryVotings} = useActions();
    const [itemOffset, setItemOffset] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const itemsPerPage = 5;

    useEffect(
        () => {
            const endOffset = itemOffset + itemsPerPage;
            SetCurrentHistoryVotings(historyVotings.slice(itemOffset, endOffset));
            setPageCount(Math.ceil(historyVotings.length / itemsPerPage));
        },
        [itemOffset, historyVotings]
    );

    const handlePageClick = (event: any) => {
        const newOffset = event.selected * itemsPerPage % historyVotings.length;
        setItemOffset(newOffset);
    };

    return (
        <>
            <div style={{}}>
                <ReactPaginate
                    nextLabel=">>"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={2}
                    pageCount={pageCount}
                    previousLabel="<<"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    breakLabel="..."
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    containerClassName="pagination justify-content-center"
                    activeClassName="active"
                    renderOnZeroPageCount={null}
                />
            </div>
        </>
    )
}

export default HistoryPagination;