import { useState } from 'react'
import Skeleton from '../shared/Skeleton'
import { FaAddressBook } from 'react-icons/fa'
import AddressInfoModal from './AddressInfoModal'
import AddAddressForm from './AddAddressForm'
import Backdrop from '../Backdrop'
import { useDispatch, useSelector } from 'react-redux'
import AddressList from './AddressList'
import { DeleteModal } from './DeleteModal';
import toast from 'react-hot-toast'
import { deleteUserAddress } from '../../store/actions'

const AddressInfo = ({ address }) => {

  const noAddressExists = !address || address.length === 0
  const { isLoading, btnLoader } = useSelector((state) => state.errors)
   
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openAddAddressModal, setOpenAddressModal] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState("")

  const dispatch = useDispatch()

  const addNewAddresshandler = () => {
    setSelectedAddress("")
    setOpenAddressModal(true)
  }

  const deleteAddressHandler = () => {
        dispatch(deleteUserAddress(
            toast,
            selectedAddress?.addressId,
            setOpenDeleteModal
        ))
    };

  return (
    <div className='pt-4 '>
        {noAddressExists ? (
            <div className='p-6 rounded-lg max-w-md mx-auto flex flex-col items-center justify-center'> 
                <FaAddressBook size={50} className='text-gray-500 mb-4' />
                <h1 className='text-slate-900 text-center font-semibold text-2xl mb-2'>No Address Added Yet</h1>
                <p className='text-slate-800 text-center mb-6'>Please add your address to complete purchase</p>

                <button  onClick={addNewAddresshandler} className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer'>
                    Add New Address
                </button>
            </div>
        ) : (
            <div className='relative p-6 rounded-lg max-w-md mx-auto'> 
                <h1 className='text-slate-800 text-center font-bold text-2xl'>Select Address</h1>
                {isLoading ? (
                    <div className='py-4 px-8'>
                        <Skeleton />
                    </div>
                ) : (
                    <>
                    <div className='space-y-4 pt-6'>
                        <AddressList setOpenDeleteModal={setOpenDeleteModal} addresses={address} setSelectedAddress={setSelectedAddress} setOpenAddressModal={setOpenAddressModal} />
                    </div>

                    {address.length > 0 && (
                        <div className='mt-4'>
                            <button onClick={addNewAddresshandler} className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer'>
                                Add More
                            </button>
                        </div>
                    )}

                    </>
                )}
            </div>
        )}

        <AddressInfoModal open={openAddAddressModal} setOpen={setOpenAddressModal}>
            <AddAddressForm address={selectedAddress} setOpenAddressModal={setOpenAddressModal}/>
        </AddressInfoModal>

        <DeleteModal 
            open={openDeleteModal}
            loader={btnLoader}
            setOpen={setOpenDeleteModal}
            title="Delete Address"
            onDeleteHandler={deleteAddressHandler}
        />

        { openAddAddressModal && <Backdrop data={false}/> }
        { openDeleteModal && <Backdrop data={false}/> }
        
    </div>
  )
}

export default AddressInfo
