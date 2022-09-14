import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
import type { RcFile } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import { ReactElement, useEffect, useState } from 'react';
import { fileCreateApi, fileDeleteApi } from '../../api/file';

type Props = {
    data: UploadFile[],
    onFileListChange(fl: UploadFile[]): void;
    maxCount?: number
}

const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });

const ImageUploader = ({ data, onFileListChange, maxCount = 5 }: Props): ReactElement => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>(data);

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };

    const onUpload = async (file: RcFile):Promise<boolean> => {
        const formData = new FormData();
        formData.append('photo', file as RcFile);
        const result = await fileCreateApi(formData);

        setFileList([...fileList, {uid:result.id, status: 'success', thumbUrl: result.url, name: result.key}]);

        return false;
    }

    const onRemove = async (file: UploadFile):Promise<boolean> => {
        const res = await fileDeleteApi(file.uid);
        const index = fileList.findIndex(item => item.uid === file.uid);
        const fileListCopy = [...fileList];
        fileListCopy.splice(index, 1)
        setFileList(fileListCopy);
        return res;
    }

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    useEffect(() => {
        onFileListChange(fileList);
    },[fileList, onFileListChange])

    return (
        <>
            <Upload
                maxCount={maxCount}
                beforeUpload={onUpload}
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onRemove={onRemove}
            >
                {fileList.length >= 8 ? null : uploadButton}
            </Upload>
            <Modal visible={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    );
};

export default ImageUploader;