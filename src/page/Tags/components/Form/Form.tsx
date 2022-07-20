import './style.scss';
import { Button, Checkbox, Form as AntdForm, Input } from 'antd';
import { TCreateTag, TUpdateTag } from '../../../../interface/Tag';
import { useContext, useEffect } from 'react';
import { GlobalContext } from '../../../../state/context';

const Item = AntdForm.Item;
const useForm = AntdForm.useForm;

export type TTagForm = Readonly<{ id?: string, parentId?: string }>;

type Props = TTagForm &{
    onClose: () => void
}

const Form = ({id, parentId, onClose}: Props) => {
    const [form] = useForm();
    const {tagMap, tagCreateHandler, tagUpdateHandler} = useContext(GlobalContext);

    const eidtTag = id ? tagMap[id] : undefined;

    const onFinish = (values: TCreateTag | TUpdateTag) => {
        if(id){
            tagUpdateHandler(id, values as TUpdateTag);
            return;
        }
        tagCreateHandler(values as TCreateTag);
      };
    
      const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
      };

      useEffect(() => {
        form.setFieldsValue({
            title: eidtTag?.title,
            isMeta: eidtTag?.isMeta,
            parent: eidtTag?.parent || parentId
        })
       }, [form, eidtTag, parentId])

    return <div className="form__root">
        <AntdForm
            form={form}
            name="loginForm"
            layout='vertical'
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Item
                label="ID"
            >
                <Input value={id} disabled/>
            </Item>
            
            <Item
                label="Title"
                name="title"
                rules={[
                    {
                        required: true,
                        message: '',
                    },
                ]}
            >
                <Input />
            </Item>

            <Item
                label="Parent Id"
                name="parent"
            >
                <Input />
            </Item>

            <Item
                name="isMeta"
            >
                <Checkbox>Meta</Checkbox>
            </Item>

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
        </AntdForm>
    </div>
};

export default Form;