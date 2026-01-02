import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';
import { Navigate, useLocation, useSearchParams } from 'react-router-dom';
import Modal from '../../shared/Modal';
import { adminOrderTableColumn } from '../../helper/tableColumn';
import UpdateOrderForm from './UpdateOrderForm';


const OrderTable = ({ adminOrders, pagination }) => {

  const [updateOpenModal, setUpdateOpenModal] = useState(false);

  const [selectedItem, setSelectedItem] = useState("");

  const [searchParams] = useSearchParams();

  const params = new URLSearchParams(searchParams);  

  const pathName = useLocation().pathname

  const [currentPage, setCurrentPage] = useState(pagination?.pageNumber + 1 || 1)

  const [loader, setLoader] = useState(false);

  const handlePaginationChange = (paginationModel) => {
    const page = paginationModel.page + 1
    setCurrentPage(page)
    params.set('page', page.toString())
    console.log(page)
    navigate(`${pathName}?${params.toString()}`)
  }  

  const tableRecords = adminOrders?.map((item) => {
    return {
        id: item?.orderId,
        email: item?.email,
        totalAmount: item?.totalAmount,
        status: item?.orderStatus,
        date: item?.orderDate
    }
  })

  const handleEdit = (order) => {
    setSelectedItem(order);
    setUpdateOpenModal(true);
  }

  return (
    <div className="">
      <h1 className="text-slate-800 text-3xl text-center font-bold pb-6 uppercase">All Orders</h1>

      <div>
        <DataGrid
        className='w-full'
        paginationMode='server'
        rowCount={pagination?.totalElements || 0}
        rows={tableRecords}
        columns={adminOrderTableColumn(handleEdit)}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: pagination?.pageSize || 10,
              page: pagination?.currentPage -1,
            },
          },
        }}
        onPaginationModelChange={handlePaginationChange}
        disableRowSelectionOnClick
        disableColumnResize
        pageSizeOptions={[pagination?.pageSize || 10]}
        pagination
        paginationOptions={{
            showFirstButton: true,
            showLastButton: true,
            hideNextButton: currentPage === pagination?.totalPages
        }}
      />
      </div>

      <Modal
        open={updateOpenModal}
        setOpen={setUpdateOpenModal}
        title='Update Order Status'>
          <UpdateOrderForm
            setOpen={setUpdateOpenModal}
            open={updateOpenModal}
            loader={loader}
            setLoader={setLoader}
            selectedId={selectedItem.id}
            selectedItem={selectedItem}
            />
      </Modal>  

    </div>
  )
}

export default OrderTable
