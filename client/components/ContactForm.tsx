import { useRef, useState } from "react"
import emailjs from '@emailjs/browser';

function ContactForm(){
  const form = useRef<HTMLFormElement>(null);
  const date = new Date
  const [formData, setFormData] = useState({ name: '', email: '', message: '', time: date})
  const [emailSent, setEmailSent] = useState('')

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
    setFormData({ name: '', email: '', message: '', time: new Date() })
  }

  const sendEmail = () => {
    if (!form.current) {
      console.error("Form reference is null.");
      return;
    }

    return emailjs.sendForm('service_nu11pea', 'template_q7cnc1p', form.current, {
        publicKey: 'rgXUnCa1OYht7rFpr',
      })
      .then(
        () => {
          console.log('SUCCESS!');
          setFormData({ name: '', email: '', message: '', time: date })
          setEmailSent('Email sent successfully!')
          
        },
        (error) => {
          console.log('FAILED...', error);
          setEmailSent('Failed to send email. Please try again.')
        },
      );
  };

  
   return (
    <div id='contact' className="w-full">
    
    <div className="bg-zinc-700 bg-opacity-40 backdrop-blur-sm grid min-h-[30rem] rounded-2xl place-content-center text-center p-4 ring-2 dark:ring-white 
    ring-zinc-800 my-10 hover:bg-opacity-60">
      <div className="flex justify-around text-xl">
      <a href="https://github.com/callum-begley" className='rounded-lg place-items-center flex justify-around hover:bg-zinc-400 px-4 py-2' target="_blank" rel="noreferrer noopener">
      <img src="/github.png" className="w-12 h-12 dark:invert mr-2" alt="github"/>GitHub</a>
      <a href="https://www.linkedin.com/in/callum-begley/" className='rounded-lg place-items-center flex justify-around hover:bg-zinc-400 px-4 py-2' target="_blank" rel="noreferrer noopener">
      <img src="/linkedin.png" className="w-12 h-12 dark:invert mr-2" alt="Linkedin"/>Linkedin</a>
      <a href="https://callum-begley.itch.io/" className='rounded-lg place-items-center flex justify-around hover:bg-zinc-400 px-4 py-2' target="_blank" rel="noreferrer noopener">
      <img src="https://static.itch.io/images/itchio-textless-black.svg" className="w-12 h-12 dark:invert mr-2" alt="Itch.io"/>Itch.io</a>
      </div>
      <h2 className="text-2xl mt-4">Email Contact Form:</h2>
      <p className="text-xl mt-4 text-lime-400">{emailSent}</p>
      <form
        onSubmit={handleSubmit}
        ref={form}
        className="ring-2 ring-zinc-600 rounded-lg place-self-center grid grid-cols-[1fr_3fr] w-full p-6 m-6"
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
          className="ring-2 ring-zinc-400 hover:bg-zinc-700 transition-colors ease-in-out duration-500 rounded-lg m-2 p-2 place-self-center col-span-2 contactFormButton"
          disabled={formData.name === ''  || formData.email === '' || formData.email.includes('@') === false || formData.email.includes('.') === false}
        >
          Submit
        </button>
      </form>
    </div>
    

    </div>
  )
}

export default ContactForm
