import { useRef, useState } from "react"
import emailjs from '@emailjs/browser';

function ContactForm(){
  const form = useRef();
  const date = new Date
  const [formData, setFormData] = useState({ name: '', email: '', message: '', time: date})

  const handleName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.currentTarget.value
    setFormData({ ...formData, name: name})
  }
  const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    const email = event.currentTarget.value
    setFormData({ ...formData, email: email})
  }
  const handleMessage = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const message = event.currentTarget.value
    setFormData({ ...formData, message: message})
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault()
    console.log(formData)
    sendEmail()
    //setFormData({ name: '', email: '', message: '' })
  }

  const sendEmail = () => {

    return emailjs.sendForm('service_nu11pea', 'template_q7cnc1p', form?.current, {
        publicKey: 'rgXUnCa1OYht7rFpr',
      })
      .then(
        () => {
          console.log('SUCCESS!');
          setFormData({ name: '', email: '', message: '', time: date })
        },
        (error) => {
          console.log('FAILED...', error);
        },
      );
  };

  
   return (
    <div className="w-full">
    
    <div className="bg-zinc-700 bg-opacity-40 backdrop-blur-sm grid min-h-[30rem] rounded-2xl place-content-center text-center p-4 ring-2 dark:ring-white 
    ring-zinc-800 my-10 hover:bg-opacity-60">
      <div className="flex justify-around">
      <a href="https://github.com/callum-begley" className='rounded-lg place-items-center flex justify-around hover:bg-zinc-400 px-4 py-2' target="_blank" rel="noreferrer noopener">
      <img src="/github.png" className="w-12 h-12 dark:invert mr-2" alt="github"/>GitHub</a>
      <a href="https://github.com/callum-begley" className='rounded-lg place-items-center flex justify-around hover:bg-zinc-400 px-4 py-2' target="_blank" rel="noreferrer noopener">
      <img src="/linkedin.png" className="w-12 h-12 dark:invert mr-2" alt="Linkedin"/>Linkedin</a>
      <a href="https://github.com/callum-begley" className='rounded-lg place-items-center flex justify-around hover:bg-zinc-400 px-4 py-2' target="_blank" rel="noreferrer noopener">
      <img src="/linkedin.png" className="w-12 h-12 dark:invert mr-2" alt="Linkedin"/>Linkedin</a>
      </div>
      <form
        onSubmit={handleSubmit}
        ref={form}
        className="ring-2 ring-zinc-600 rounded-lg place-self-center grid grid-cols-[1fr_3fr] w-96 p-6 m-6"
      >
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          placeholder={'Name'}
          onChange={handleName}
          className="ring-2 ring-zinc-400 rounded-lg m-2 p-1"
        />
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          name="email"
          type="text"
          placeholder={'Email'}
          value={formData.email}
          onChange={handleEmail}
          className="ring-2 ring-zinc-400 rounded-lg m-2 p-1"
        />
        <label htmlFor="message">Message:</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          rows={4}
          placeholder={'Type message here...'}
          onChange={handleMessage}
          className="ring-2 ring-zinc-400 rounded-lg m-2 p-1 dark:bg-zinc-600"
        />
        <button
          type="submit"
          className="ring-2 ring-zinc-400 hover:bg-zinc-700 transition-colors ease-in-out duration-500 rounded-lg m-2 p-2 place-self-center col-span-2"
          disabled={formData.name === ''  || formData.email === ''}
        >
          Submit
        </button>
      </form>
    </div>
    

    </div>
  )
}

export default ContactForm
