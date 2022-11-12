import { Button, Form as AntdForm, Input, Upload } from 'antd';
import { useCallback, useContext, useState } from 'react';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import styled from 'styled-components';
import { ImagesContext } from '../../../../state/imagesContext';
import { UploadOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/lib/upload';

const Item = AntdForm.Item;
const useForm = AntdForm.useForm;

export type TNoteForm = Readonly<{ id?: string }>;

type Props = Readonly<{
    values: TNoteForm
    onClose: () => void
    onSelect: (id: string) => void
}>


const Container = styled.div`
  padding: 1.2em;
  height: 100%;
  .file_form {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;

    .form-div {

    }

    &__buttons {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 2rem;
    }
    &__item {
        padding: 0.6rem;
        border: 1px dashed #dfdcdc
    }
   }
`;

const Form = ({ onClose }: Props) => {
    const [form] = useForm();
    const { imageCreateHandler } = useContext(ImagesContext);

    const [file, setFile] = useState<RcFile | undefined>(undefined);
    
    const onUpload = useCallback(async(file: RcFile):Promise<boolean> => {
        setFile(file);
        return false;
    }, []);

    const onFinish = async (value: { name: string }) => {
        try {
            const formData = new FormData();
            const fileNameSplited = file?.name.split('.').reverse() || [];
            formData.append('image', file as RcFile, `${value.name}.${fileNameSplited[0] || 'txt'}`);
            await imageCreateHandler(formData);
            onClose();
        }catch(e){
            console.error(e);
        } 
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return <Container>
        <AntdForm
            form={form}
            name="fileForm"
            layout='vertical'
            onFinish={onFinish}
            className="file_form"
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <div className='form-div'>
                <Item
                    label="Name"
                    name="name"
                    className='note_form__item'
                    rules={[
                        {
                            required: true,
                            message: '',
                        },
                    ]}
                >
                    <Input />
                </Item>
                <Upload
                    listType="picture"
                    beforeUpload={onUpload}
                    maxCount={1}
                >
                    <Button icon={<UploadOutlined/>}>Upload</Button>
                </Upload>
            </div>
            <div className='form-div'>
                <Item>
                    <div className="form__buttons">
                        <Button type="default" size='large' htmlType="button" onClick={onClose}>
                            Close
                        </Button>
                        <Button type="primary" size='large' htmlType="submit">
                            Submit
                        </Button>
                    </div>
                </Item>
            </div>
        </AntdForm>
    </Container>
};

export default Form;