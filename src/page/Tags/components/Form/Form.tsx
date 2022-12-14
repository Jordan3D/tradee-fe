import './style.scss';
import { Button, Checkbox, Form as AntdForm, Input, Select } from 'antd';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import { CreateTag, UpdateTag } from '../../../../interface/Tag';
import { useContext, useEffect, useMemo } from 'react';
import { GlobalContext } from '../../../../state/context';
import { useSelector } from 'react-redux';
import { selectTagList, selectTagMap } from '../../../../store/common/tags';
import TagRender from '../../../../components/Tags/TagRender';

const Item = AntdForm.Item;
const useForm = AntdForm.useForm;

export type TTagForm = Readonly<{ id?: string, parentId?: string }>;

type Props = TTagForm & {
    values: TTagForm
    onClose: () => void
}

const Form = ({ values, onClose }: Props) => {
    const { id, parentId } = values;
    const [form] = useForm();
    const tagList = useSelector(selectTagList);
    const tagMap = useSelector(selectTagMap); 
    const { tagCreateHandler, tagUpdateHandler } = useContext(GlobalContext);

    const eidtTag = id ? tagMap[id] : undefined;

    const tagOptions = useMemo(() => tagList.map(tag => ({ label: tag.title, value: tag.id }) as CustomTagProps), [tagList]);

    const onFinish = (values: CreateTag | UpdateTag) => {
        console.log(values);
        if (id && id !== 'new') {
            tagUpdateHandler(id, values as UpdateTag);
            return;
        }
        tagCreateHandler(values as CreateTag);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const onSelectClear = () => {
        setTimeout(() => {
            form.setFieldsValue({
                parentId: null
            })
        })
    }

    useEffect(() => {
        form.setFieldsValue({
            title: eidtTag?.title,
            isMeta: eidtTag?.isMeta,
            parentId: eidtTag?.parentId || parentId
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
                <Input value={id} disabled />
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
                label="Parent"
                name="parentId"
            >
                <Select
                    showArrow
                    allowClear
                    onClear={onSelectClear}
                    tagRender={TagRender({})}
                    style={{ width: '100%' }}
                    options={tagOptions}
                />
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