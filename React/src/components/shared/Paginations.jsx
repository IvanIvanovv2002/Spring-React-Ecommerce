import { Pagination } from "@mui/material";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const Paginations = ( { totalPages, totalProducts }) => {
    const [searchParams] = useSearchParams()
    const pathName = useLocation().pathname
    const params = new URLSearchParams(searchParams)
    const navigate = useNavigate()

    const currentPage = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

    const onChangeHandler = (event, value) => {
        params.set('page', value.toString())
        navigate(`${pathName}?${params}`);
    }

    return (
        <div>
            <Pagination
                count={totalPages} 
                page={currentPage}
                defaultPage={1} 
                siblingCount={2} 
                boundaryCount={2}
                shape="rounded"
                size="large"
                onChange={onChangeHandler}
            />
        </div>
    )
}

export default Paginations;

