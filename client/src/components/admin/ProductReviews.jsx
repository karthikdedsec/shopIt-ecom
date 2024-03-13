import { useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import MetaData from "../layout/MetaData";
import { MDBDataTable } from "mdbreact";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Loader from "../layout/Loader";
import { Link } from "react-router-dom";
import {
  useDeleteReviewMutation,
  useLazyGetProductReviewsQuery,
} from "../../redux/api/productsApi";

const ProductReviews = () => {
  const [productId, setProductId] = useState("");

  const [getProductReviews, { data, isLoading, error }] =
    useLazyGetProductReviewsQuery();

  const [
    deleteReview,
    { error: deleteError, isLoading: isDeleteLoading, isSuccess },
  ] = useDeleteReviewMutation();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
    if (deleteError) {
      toast.error(deleteError?.data?.message);
    }
    if (isSuccess) {
      toast.success("review deleted");
    }
  }, [error, deleteError, isSuccess]);

  const submitHandler = (e) => {
    e.preventDefault();
    getProductReviews(productId);
  };

  const deleteReviewHandler = (id) => {
    deleteReview({ productId, id });
  };

  const setReviews = () => {
    const reviews = {
      columns: [
        {
          label: "Review ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Rating",
          field: "rating",
          sort: "asc",
        },
        {
          label: "Comment",
          field: "comment",
          sort: "asc",
        },
        {
          label: "User",
          field: "user",
          sort: "asc",
        },

        {
          label: "Actions",
          field: "actions",
          sort: "asc",
        },
      ],
      rows: [],
    };

    data?.reviews?.forEach((review) => {
      reviews.rows.push({
        id: review?._id,
        rating: review?.rating,
        comment: review?.comment,
        user: review?.user?.name,
        actions: (
          <>
            <button
              className="btn btn-outline-danger ms-2"
              onClick={() => deleteReviewHandler(review?._id)}
              disabled={isDeleteLoading}
            >
              <i className="fa fa-trash"></i>
            </button>
          </>
        ),
      });
    });

    return reviews;
  };

  return (
    <>
      <AdminLayout>
        <MetaData title={"Product Reviews"} />
        <div className="row justify-content-center my-5">
          <div className="col-6">
            <form onSubmit={submitHandler}>
              <div className="mb-3">
                <label htmlFor="productId_field" className="form-label">
                  Enter Product ID
                </label>
                <input
                  type="text"
                  id="productId_field"
                  className="form-control"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                />
              </div>

              <button
                id="search_button"
                type="submit"
                className="btn btn-primary w-100 py-2"
              >
                SEARCH
              </button>
            </form>
          </div>
        </div>

        <h5 className="mt-3 text-center">
          Product name: <b></b>
        </h5>
        <MDBDataTable
          data={setReviews()}
          className="px-3"
          bordered
          striped
          hover
        />
      </AdminLayout>
    </>
  );
};
export default ProductReviews;
