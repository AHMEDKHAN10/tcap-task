/* eslint-disable no-loop-func */
/* eslint-disable no-unused-expressions */
import React, { useState, useContext } from "react";
import { Space, Table, Button, Modal, Radio } from "antd";
import axios from "axios";
import { TokenContext } from "../context/contextToken";
import { getNumblockList } from "../functions/functions";

function Numblock() {
  const { token, numBlockList, setNumBlockList } = useContext(TokenContext);
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalData, setModalData] = useState(numBlockList[0]);
  const [splitBlockSizes, setSplitBlockSizes] = useState([1,5,10,100])
  const [mergeBlockSizes, setMergeBlockSizes] = useState([]);
  const [newSplitBlockSize, setnewSplitBlockSize] = useState(0);
  const [selectedMergeBlockSize, setSelectedMergeBlockSize] = useState([]);
  const [mergeNumbers, setMergeNumbers] = useState([]);
  const [loading, setLoading] = useState(false);

  const showModal = async (record) => {
    setIsSplitModalOpen(true);
    setModalData(record);
    if (record.blockSize <= 100 && record.blockSize > 10) {
      setSplitBlockSizes([1,5,10])
    } else if (record.blockSize <= 10 && record.blockSize > 5) {
      setSplitBlockSizes([1,5])
    } else if (record.blockSize <= 5) {
      setSplitBlockSizes([1]);
    } else {
      setSplitBlockSizes([1,5,10,100]);
    }
  };

  const showMergeModal = async (record) => {
    setIsMergeModalOpen(true);
    let indexOfFirstNumberInSequence = await numBlockList.findIndex(
      (item) =>
        item.firstNumber === JSON.stringify(Number(record.lastNumber) + 1)
    );
    let indexOfLastNumberInSequence = await numBlockList.findIndex(
      (item) =>
        item.lastNumber === JSON.stringify(Number(record.firstNumber) - 1)
    );
    let tempLastNum = record.lastNumber;
    let tempFirstNum = record.firstNumber;
    let tempNumArray = [];
    if(indexOfFirstNumberInSequence > -1 || indexOfLastNumberInSequence > -1) {
      tempNumArray.push({
        firstNumber: Number(record.firstNumber),
        lastNumber: Number(record.lastNumber),
        id: record.id,
        blockSize: record.blockSize,
      });
    }
    while (indexOfFirstNumberInSequence > -1 || indexOfLastNumberInSequence > -1) {
      setMergeNumbers(tempNumArray);
      indexOfFirstNumberInSequence = numBlockList.findIndex(
        (item) => item.firstNumber === JSON.stringify(Number(tempLastNum) + 1)
      );
      indexOfLastNumberInSequence = numBlockList.findIndex(
        (item) => item.lastNumber === JSON.stringify(Number(tempFirstNum) - 1)
      );
      if (indexOfFirstNumberInSequence !== -1) {
        let obj = {
          firstNumber: Number(numBlockList[indexOfFirstNumberInSequence].firstNumber),
          lastNumber: Number(numBlockList[indexOfFirstNumberInSequence].lastNumber),
          id: numBlockList[indexOfFirstNumberInSequence].id,
          blockSize: numBlockList[indexOfFirstNumberInSequence].blockSize,
        };
        tempNumArray.indexOf(obj) === -1 ? tempNumArray.push(obj) : null;
        tempLastNum = numBlockList[indexOfFirstNumberInSequence].lastNumber;
      }
      if (indexOfLastNumberInSequence !== -1) {
        let obj = {
          firstNumber: Number(numBlockList[indexOfLastNumberInSequence].firstNumber),
          lastNumber: Number(numBlockList[indexOfLastNumberInSequence].lastNumber),
          id: numBlockList[indexOfLastNumberInSequence].id,
          blockSize: numBlockList[indexOfLastNumberInSequence].blockSize,
        };
        tempNumArray.indexOf(obj) === -1 ? tempNumArray.push(obj) : null;
        tempFirstNum = numBlockList[indexOfLastNumberInSequence].firstNumber;
      }
      setMergeNumbers(tempNumArray);
    }
    let arr = [];
    arr = tempNumArray
      .map((item) => item.blockSize)
      .filter((value, index, self) => self.indexOf(value) === index)
      console.log(arr.sort())
    
    
    setMergeBlockSizes(arr.sort())
  };

  const showDeleteModal = async (record) => {
    setIsDeleteModalOpen(true);
  };

  const handleSplitOk = async () => {
    
    if(newSplitBlockSize !== 0 ){
      setLoading(true);
      updateNumBlockForSplit().then( () => {
        getNumblockList(token).then((list) => setNumBlockList(list))
        setLoading(false)
        setIsSplitModalOpen(false)
      })
      return
    }
    setIsSplitModalOpen(false)
  }

  const handleMergeOk = async () => {
    if(mergeBlockSizes.length > 0){
      setLoading(true)
      updateNumBlockForMerge().then(() => {
        getNumblockList(token).then((list) => setNumBlockList(list))
        setLoading(false)
        setIsMergeModalOpen(false)
      })
      return
    } 
    setIsMergeModalOpen(false)
  }

  const handleDeleteOk = async () => {
    setLoading(true);
    await onDelete().then(() => {
      getNumblockList(token).then((list) => setNumBlockList(list));
      setLoading(false);
    });
    setIsDeleteModalOpen(false);
  };

  const handleCancel = () => {
    isSplitModalOpen ? setIsSplitModalOpen(false) : null;
    isMergeModalOpen ? setIsMergeModalOpen(false) : null;
    isDeleteModalOpen ? setIsDeleteModalOpen(false) : null;
  };

  const handleSplitBlockSizeChange = (e) => {
    setnewSplitBlockSize(e.target.value);
  };

  const handleMergeBlockSizeChange = (e) => {
    setSelectedMergeBlockSize(e.target.value);
  };

  const updateNumBlockForSplit = async (e) => {
    const currentNumblockSize = Number(modalData.blockSize);
    let currentFirstNumber = Number(modalData.firstNumber);
    const newNumberBlockSize = Number(newSplitBlockSize);

    const numBlockSets = currentNumblockSize / newNumberBlockSize;

    await axios.delete(
      `https://launch.tcap.dev/api/ui/NumberBlock/${modalData.id}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-RequestScope": 60,
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          Authorization: `Bearer ${token}`,
        },
      }
    ).catch((e) => alert(e))

    for (let x = 0; x < numBlockSets; x++) {
      if (x !== 0) {
        currentFirstNumber = currentFirstNumber + newNumberBlockSize;
      }
      const body = {
        companyID: null,
        company: null,
        partnerID: "76ff1fb3-4f45-4166-d96a-08db571769d2",
        partner: "string",
        wholesalerID: "83de4fad-99c1-4eb3-4f41-08db5770e770",
        wholesaler: "string",
        carrierID: "d340a23c-ee4e-4f08-b626-08d7010900d1",
        carrier: "string",
        inboundCarrierID: "d340a23c-ee4e-4f08-b626-08d7010900d1",
        inboundCarrier: "string",
        outboundCarrierID: "d340a23c-ee4e-4f08-b626-08d7010900d1",
        outboundCarrier: "string",
        blockSize: newNumberBlockSize,
        pattern: "string",
        publicPool: true,
        first: JSON.stringify(currentFirstNumber),
        last: "",
        pendingUpdate: true,
        numberBlockPortingType: 0,
        cliPresentation: "string",
        isSpecialNumber: false,
        internalNotes: "string",
        attribute1: "string",
        attribute2: "string",
        attribute3: "string",
      };

      await axios.post(`https://launch.tcap.dev/api/ui/NumberBlock`, body, {
        headers: {
          "Content-Type": "application/json",
          "X-RequestScope": 60,
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          Authorization: `Bearer ${token}`,
        },
      }).catch((e) => alert(e))
    }
  };

  const onDelete = async () => {
    await axios.delete(
      `https://launch.tcap.dev/api/ui/NumberBlock/${modalData.id}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-RequestScope": 60,
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          Authorization: `Bearer ${token}`,
        },
      }
    ).catch((e) => alert(e))
  };

  function getMinMergeFirstNumber(data) {
    return data.reduce(
      (min, p) => (p.firstNumber < min ? p.firstNumber : min),
      data[0].firstNumber
    );
  }

  const deleteForMerge = async (tempArr) => {
    for (const item of tempArr) {
      await axios.delete(
        `https://launch.tcap.dev/api/ui/NumberBlock/${item.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-RequestScope": 60,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
            Authorization: `Bearer ${token}`,
          },
        }
      ).catch((e) => alert(e))
    }
  };

  const updateNumBlockForMerge = async (e) => {
    let tempArr = mergeNumbers.filter((obj) => {
      return obj.blockSize === selectedMergeBlockSize;
    });

    const blockSize = tempArr.length * selectedMergeBlockSize
    const body = {
      companyID: null,
      company: null,
      partnerID: "76ff1fb3-4f45-4166-d96a-08db571769d2",
      partner: "string",
      wholesalerID: "83de4fad-99c1-4eb3-4f41-08db5770e770",
      wholesaler: "string",
      carrierID: "d340a23c-ee4e-4f08-b626-08d7010900d1",
      carrier: "string",
      inboundCarrierID: "d340a23c-ee4e-4f08-b626-08d7010900d1",
      inboundCarrier: "string",
      outboundCarrierID: "d340a23c-ee4e-4f08-b626-08d7010900d1",
      outboundCarrier: "string",
      blockSize: blockSize,
      pattern: "string",
      publicPool: true,
      first: JSON.stringify(getMinMergeFirstNumber(tempArr)),
      last: "",
      pendingUpdate: true,
      numberBlockPortingType: 0,
      cliPresentation: "string",
      isSpecialNumber: false,
      internalNotes: "string",
      attribute1: "string",
      attribute2: "string",
      attribute3: "string",
    };

    const validBlockSizes = [1,5,10,100]
    const isValidBlockSize = await validBlockSizes.findIndex((item) => item === blockSize)
    if(isValidBlockSize > -1) {
      deleteForMerge(tempArr).then(() => {
        axios.post(`https://launch.tcap.dev/api/ui/NumberBlock`, body, {
          headers: {
            "Content-Type": "application/json",
            "X-RequestScope": 60,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
            Authorization: `Bearer ${token}`,
          },
        });
      });
    } else {
      alert('Error! The merged block size is not 1,5,10 or 100 ')
    }
    
  };

  const columns = [
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
      // render: (text) => <a>{text}</a>,
    },
    {
      title: "Block Size",
      dataIndex: "blockSize",
      key: "blockSize",
      sorter: {
        compare: (a, b) => a.blockSize - b.blockSize,
        multiple: 2,
      },
    },
    {
      title: "First Number",
      dataIndex: "firstNumber",
      key: "firstNumber",
      sorter: {
        compare: (a, b) => a.firstNumber - b.firstNumber,
        multiple: 2,
      },
    },
    {
      title: "Last Number",
      dataIndex: "lastNumber",
      key: "lastNumber",
      sorter: {
        compare: (a, b) => a.firstNumber - b.firstNumber,
        multiple: 2,
      },
    },
    {
      title: "Inbound Carrier",
      dataIndex: "inboundCarrier",
      key: "inboundCarrier",
    },
    {
      title: "Outbound Carrier",
      dataIndex: "outboundCarrier",
      key: "outboundCarrier",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => showModal(record)}>
            Split
          </Button>
          <Button type="primary" onClick={() => showMergeModal(record)}>
            Merge
          </Button>
          <Button type="primary" onClick={() => showDeleteModal(record)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table columns={columns} dataSource={numBlockList} />

      <Modal
        open={isSplitModalOpen}
        onOk={handleSplitOk}
        onCancel={handleCancel}
        confirmLoading={loading}
      >
        <Space direction="vertical" size={50}>
          <div>
            <p>Split Block Size</p>
            <Radio.Group size={50} value={newSplitBlockSize} onChange={handleSplitBlockSizeChange}>
              {splitBlockSizes.map((item, key) => (
                <Radio.Button key={key} value={item}>
                  {item}
                </Radio.Button>
              ))}
            </Radio.Group>
          </div>
        </Space>
      </Modal>
      <Modal
        open={isDeleteModalOpen}
        onOk={handleDeleteOk}
        onCancel={handleCancel}
        confirmLoading={loading}
        okText="Yes"
        cancelText="No"
      >
        <Space direction="vertical" size={50}>
          <p>Are you sure you want to delete this num-block?</p>
        </Space>
      </Modal>
      <Modal
        open={isMergeModalOpen}
        onOk={handleMergeOk}
        onCancel={handleCancel}
        confirmLoading={loading}
      >
        <Space direction="vertical" size={50}>
          <div>
            <h2>Available block sizes to merge</h2>
            <Radio.Group size={50} onChange={handleMergeBlockSizeChange}>
              {
                mergeBlockSizes.map((item, key) => (
                  <Radio.Button key={key} value={item}>
                    {item}
                  </Radio.Button>
                ))
              }
              {
                mergeBlockSizes.length > 0
                ?   <Radio.Button value={0}>Merge All</Radio.Button>
                : <p>No available number blocks to merge with!</p>
              }
            </Radio.Group>
          </div>
        </Space>
      </Modal>
    </>
  );
}

export default Numblock;
