import React from 'react';

const ModalManager = ({
  type,
  showModal,
  closeModal,
  modalData,
  options,
  handleInputChange,
  handleSubmit,
}) => {
  if (!showModal) return null;

  return (
    <div className="modal">
      <h2>{type}</h2>
      <div className="modal-content">
        {type === 'Add Stock' && (
          <>
            <input
              type="text"
              name="drugName"
              placeholder="Drug Name"
              value={modalData.drugName || ''}
              onChange={handleInputChange}
            />
            <textarea
              name="description"
              placeholder="Description"
              value={modalData.description || ''}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="batchId"
              placeholder="Batch ID"
              value={modalData.batchId || ''}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={modalData.quantity || ''}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="salePrice"
              placeholder="Sale Price"
              value={modalData.salePrice || ''}
              onChange={handleInputChange}
            />
            <input
              type="date"
              name="manufactureDate"
              placeholder="Manufacture Date"
              value={modalData.manufactureDate || ''}
              onChange={handleInputChange}
            />
            <input
              type="date"
              name="expiryDate"
              placeholder="Expiry Date"
              value={modalData.expiryDate || ''}
              onChange={handleInputChange}
            />
          </>
        )}
        {type === 'Place Order' && (
            <>
                <input
                type="text"
                name="drugName"
                placeholder="Drug Name"
                value={modalData.drugName || ''}
                onChange={handleInputChange}
                />
                <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={modalData.quantity || ''}
                onChange={handleInputChange}
                />
                <select
                name="wholesalerId"
                value={modalData.wholesalerId || ''}
                onChange={handleInputChange}
                >
                <option value="">Select Wholesaler</option>
                {options.map((wholesaler) => (
                    <option key={wholesaler.user_id} value={wholesaler.user_id}>
                    {wholesaler.name} - {wholesaler.sale_price}
                    </option>
                ))}
                </select>
                <select
                name="paymentMethod"
                value={modalData.paymentMethod || ''}
                onChange={handleInputChange}
                >
                <option value="">Select Payment Method</option>
                <option value="M-Pesa">M-Pesa</option>
                <option value="Credit Card">Credit Card</option>
                </select>
            </>
            )}

        {type === 'Edit Stock' && (
          <>
            <input
              type="number"
              name="salePrice"
              placeholder="Sale Price"
              value={modalData.salePrice || ''}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={modalData.quantity || ''}
              onChange={handleInputChange}
            />
          </>
        )}

        {type === 'Restock' && (
          <>
            <h2>Restock Drug</h2>
            <div className="modal-content">
            <label>Quantity:</label>
            <input
                type="number"
                name="quantity"
                placeholder="Enter quantity"
                value={modalData.quantity}
                onChange={(e) =>
                handleInputChange({
                    ...modalData,
                    quantity: e.target.value,
                })
                }
            />

            <label>Select Wholesaler:</label>
            <select
                name="wholesalerId"
                value={modalData.wholesalerId}
                onChange={(e) =>
                handleInputChange({
                    ...modalData,
                    wholesalerId: e.target.value,
                })
                }
            >
                <option value="">Select Wholesaler</option>
                {options.map((wholesaler) => (
                <option key={wholesaler.user_id} value={wholesaler.user_id}>
                    {wholesaler.name} - {wholesaler.sale_price}
                </option>
                ))}
            </select>

            <label>Payment Method:</label>
            <select
                name="paymentMethod"
                value={modalData.paymentMethod}
                onChange={(e) =>
                handleInputChange({
                    ...modalData,
                    paymentMethod: e.target.value,
                })
                }
            >
                <option value="">Select Payment Method</option>
                <option value="M-Pesa">M-Pesa</option>
                <option value="Credit Card">Credit Card</option>
            </select>

            <button onClick={handleSubmit}>Submit</button>
            <button onClick={closeModal}>Close</button>
            </div>
         </>
        )}
        <button onClick={handleSubmit}>Submit</button>
        <button onClick={closeModal}>Close</button>
      </div>
    </div>
  );
};

export default ModalManager;
