import React, { useEffect, useState } from "react";
import CardLoading from "../components/CardLoading";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import CardProduct from "../components/CardProduct";
import InfiniteScroll from "react-infinite-scroll-component";
import { useLocation } from "react-router-dom";
import NoDataFound from "../components/Nodata";

const SearchPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingArrayCard = new Array(10).fill(null);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const params = useLocation();
  const searchText = params.search.slice(3);
  const fetchData = async () => {
    try {
      setLoading(true);
      const resp = await Axios({
        ...SummaryApi.searchProduct,
        data: {
          search: searchText,
          page: page,
        },
      });
      const { data: respData } = resp;
      if (respData.success) {
        if (respData.page == 1) {
          setData(respData.data);
        } else {
          setData((prev) => {
            return [...prev, ...respData.data];
          });
        }
        setTotalPage(respData.totalNoPage);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };
  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };
  useEffect(() => {
    fetchData();
  }, [page, searchText]);
  return (
    <section className="bg-white">
      <div className="container mx-auto p-4">
        <p className="font-semibold">Search Results: {data.length} </p>
        <InfiniteScroll
          dataLength={data.length}
          next={handleLoadMore}
          hasMore={true}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 py-5 gap-4">
            {data.map((p, index) => (
              <CardProduct data={p} key={index} />
            ))}
            {
              !loading && !data[0] && (
                <div className="col-span-full">
                  <NoDataFound />
                </div>
              )
            }
            {loading &&
              loadingArrayCard.map((_, index) => <CardLoading key={index} />)}
          </div>
        </InfiniteScroll>
      </div>
    </section>
  );
};

export default SearchPage;
