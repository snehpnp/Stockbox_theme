import React, {useState} from 'react';
import Contnet from '../Contents/Content'
import Modal from 'react-modal';

const Modals = () => {

  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <Contnet Page_title="Modals">
      
      <div>
        <button onClick={openModal}>Open Modal</button>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
        >      
        <div className='modal-header'>
          Modal Head
          <button onClick={closeModal} className='modal-close-btn-head' ><i className="fa-solid fa-xmark"></i></button>
        </div>
        <div className='modal-body'>
          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>

          <div className='modal-btn-div'>
            <button onClick={closeModal} className='btn btn-primary' >close</button>
            <button className='btn btn-success' >Save</button>
          </div>
        </div>
      </Modal>
    </div>



    <div className="accordion accordion-flush mt-5 accordion-plus" id="accordionFlushExample">
      <div className="accordion-item">
        <h2 className="accordion-header" id="flush-headingOne">
          <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
            Accordion Item #1
          </button>
        </h2>
        <div id="flush-collapseOne" className="accordion-collapse collapse show" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
          <div className="accordion-body">Placeholder content for this accordion, which is intended to demonstrate the <code>.accordion-flush</code> class. This is the first item's accordion body.</div>
        </div>
      </div>
      <div className="accordion-item">
        <h2 className="accordion-header" id="flush-headingTwo">
          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
            Accordion Item #2
          </button>
        </h2>
        <div id="flush-collapseTwo" className="accordion-collapse collapse" aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">
          <div className="accordion-body">Placeholder content for this accordion, which is intended to demonstrate the <code>.accordion-flush</code> class. This is the second item's accordion body. Let's imagine this being filled with some actual content.</div>
        </div>
      </div>
      <div className="accordion-item">
        <h2 className="accordion-header" id="flush-headingThree">
          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
            Accordion Item #3
          </button>
        </h2>
        <div id="flush-collapseThree" className="accordion-collapse collapse" aria-labelledby="flush-headingThree" data-bs-parent="#accordionFlushExample">
          <div className="accordion-body">Placeholder content for this accordion, which is intended to demonstrate the <code>.accordion-flush</code> class. This is the third item's accordion body. Nothing more exciting happening here in terms of content, but just filling up the space to make it look, at least at first glance, a bit more representative of how this would look in a real-world application.</div>
        </div>
      </div>
    </div>

    <div className="accordion accordion-flush mt-5 accordion-arrow" id="accordionFlushExample1">
      <div className="accordion-item">
        <h2 className="accordion-header" id="flush-headingOne1">
          <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne1" aria-expanded="false" aria-controls="flush-collapseOne1">
            Accordion Item #1
          </button>
        </h2>
        <div id="flush-collapseOne1" className="accordion-collapse collapse show" aria-labelledby="flush-headingOne1" data-bs-parent="#accordionFlushExample1">
          <div className="accordion-body">Placeholder content for this accordion, which is intended to demonstrate the <code>.accordion-flush</code> class. This is the first item's accordion body.</div>
        </div>
      </div>
      <div className="accordion-item">
        <h2 className="accordion-header" id="flush-headingTwo1">
          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo1" aria-expanded="false" aria-controls="flush-collapseTwo1">
            Accordion Item #2
          </button>
        </h2>
        <div id="flush-collapseTwo1" className="accordion-collapse collapse" aria-labelledby="flush-headingTwo1" data-bs-parent="#accordionFlushExample1">
          <div className="accordion-body">Placeholder content for this accordion, which is intended to demonstrate the <code>.accordion-flush</code> class. This is the second item's accordion body. Let's imagine this being filled with some actual content.</div>
        </div>
      </div>
      <div className="accordion-item">
        <h2 className="accordion-header" id="flush-headingThree1">
          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree1" aria-expanded="false" aria-controls="flush-collapseThree1">
            Accordion Item #3
          </button>
        </h2>
        <div id="flush-collapseThree1" className="accordion-collapse collapse" aria-labelledby="flush-headingThree1" data-bs-parent="#accordionFlushExample1">
          <div className="accordion-body">Placeholder content for this accordion, which is intended to demonstrate the <code>.accordion-flush</code> class. This is the third item's accordion body. Nothing more exciting happening here in terms of content, but just filling up the space to make it look, at least at first glance, a bit more representative of how this would look in a real-world application.</div>
        </div>
      </div>
    </div>  

    </Contnet>
  );
};

export default Modals;
