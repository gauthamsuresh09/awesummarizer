from pathlib import Path

from google.cloud import storage

import logging
logger = logging.getLogger()


def download_data(
    gcs_bucket_name: str, path_prefix: str = "", local_path: str = "./data"
):
    logger.info(f"Local Path : {local_path}")
    data_path = Path(local_path).resolve()
    logger.info(f"Data Path : {data_path}")
    data_path.mkdir(exist_ok=True)
    client = storage.Client()
    bucket = client.bucket(gcs_bucket_name)
    blobs = list(bucket.list_blobs(prefix=path_prefix))
    blob_names = [blob.name for blob in blobs]
    logger.info(f"Downloading following files: {blob_names}")
    for blob in blobs:
        if blob.name[-1] == "/":
            continue
        filename = (data_path / f"{blob.name}").resolve()
        logger.info(f"Filename : {filename}")
        parent_path = Path(filename).parent
        logger.info(f"Parent Path: {parent_path}")
        parent_path.mkdir(parents=True, exist_ok=True)
        blob.download_to_filename(filename)


def download_blob(bucket_name, source_blob_name, destination_file_name):
    """Downloads a blob from the bucket."""
    # bucket_name = "your-bucket-name"
    # source_blob_name = "storage-object-name"
    # destination_file_name = "local/path/to/file"
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(source_blob_name)
    blob.download_to_filename(destination_file_name)
