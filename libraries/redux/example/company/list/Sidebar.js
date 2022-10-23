// ** React Import
import { useState } from 'react'

// ** Custom Components
import Sidebar from '@components/sidebar'

// ** Third Party Components
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import { X, Check } from 'react-feather'

// ** Reactstrap Imports
import { Button, Label, Form, Input } from 'reactstrap'

// ** Store & Actions
import { addCompany } from '../company/store'
import { useDispatch } from 'react-redux'

const defaultValues = {
  name: '',
  address: '',
  city: ''
}

const checkIsValid = data => {
  return Object.values(data).every(field => (typeof field === 'object' ? field !== null : field.length > 0))
}

const CustomLabel = ({ htmlFor }) => {
  return (
    <Label className='form-check-label' htmlFor={htmlFor}>
      <span className='switch-icon-left'>
        <Check size={14} />
      </span>
      <span className='switch-icon-right'>
        <X size={14} />
      </span>
    </Label>
  )
}

const SidebarNewCompany = ({ open, toggleSidebar }) => {
  // ** States
  const [status, setStatus] = useState('1')

  // ** Store Vars
  const dispatch = useDispatch()

  // ** Vars
  const {
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  // ** Function to handle form submit
  const onSubmit = data => {
    if (checkIsValid(data)) {
      dispatch(
        addCompany({
          name: data.name,
          city: data.city,
          address: data.address,
          is_status: +status
        })
      ).then((res) => {
        const { status, message } = res.payload
        if (status) {
          toggleSidebar()
          toast.success(message, {
            position: 'top-center'
          })
        } else {
          message.map((item, index) => {
            setTimeout(() => {
              toast.error(item, {
                position: 'top-center'
              })
            }, 1000 * index)
          })
        }
      })
    } else {
      for (const key in data) {
        if (data[key] !== null && data[key].length === 0) {
          setError(key, {
            type: 'manual'
          })
        }
      }
      toast.error('Please fill out all input.', {
        position: 'top-center'
      })
    }
  }

  const handleSidebarClosed = () => {
    for (const key in defaultValues) {
      setValue(key, '')
    }
    setStatus('1')
  }

  return (
    <Sidebar
      size='lg'
      open={open}
      title='New Company'
      headerClassName='mb-1'
      contentClassName='pt-0'
      toggleSidebar={toggleSidebar}
      onClosed={handleSidebarClosed}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-1'>
          <Label className='form-label' for='name'>
            Company Name<span className='text-danger'>*</span>
          </Label>
          <Controller
            name='name'
            control={control}
            render={({ field }) => (
              <Input 
                id='name'
                placeholder='PT. Ayo Menebar Kebaikan'
                invalid={errors.name && true}
                {...field} 
              />
            )}
          />
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='city'>
            City <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='city'
            control={control}
            render={({ field }) => (
              <Input 
                id='city' 
                placeholder='Sukoharjo'
                invalid={errors.city && true}
                {...field} 
              />
            )}
          />
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='address'>
            Address <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='address'
            control={control}
            render={({ field }) => (
              <Input
                type='text'
                id='address'
                placeholder='Jl. Solo - Wonogiri'
                invalid={errors.address && true}
                {...field}
              />
            )}
          />
        </div>

        <div className='mb-1'>
          <Label for='status' className='form-label mb-50'>
            Status
          </Label>
          <div className='form-switch form-check-primary'>
            <Input 
              type='switch' 
              id='status' 
              name='status'
              value={status === '0' ? '1' : '0'}
              onChange={e => setStatus(e.target.value)}
              checked={status === '1'}
            />
            <Label htmlFor='status' className={`ms-1 ${status === '1' ? 'text-primary' : ''}`}>
              {status === '1' ? 'Active' : 'Inactive'}
            </Label>
            <CustomLabel htmlFor='status' />
          </div>
        </div>

        <Button type='submit' className='me-1' color='primary'>
          Submit
        </Button>
        <Button type='reset' color='secondary' outline onClick={toggleSidebar}>
          Cancel
        </Button>
      </Form>
    </Sidebar>
  )
}

export default SidebarNewCompany
