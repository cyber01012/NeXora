import { useEffect, useState } from 'react';

import { helpDeskApi }
from '../../services/HelpDesk/helpDeskApi';

export default function CreateSOS() {

  const [natures, setNatures] =
    useState([]);

  const [formData, setFormData] =
    useState({

      name: '',
      callerPhone: '',
      province: '',
      district: '',
      town: '',
      area: '',
      city: '',
      complaintNatureId: '',
      priority: 'NORMAL',
      detail: ''
    });

    const [showConfirm, setShowConfirm] =
  useState(false);

const [showSuccess, setShowSuccess] =
  useState(false);

const [submitting, setSubmitting] =
  useState(false);

const [notification, setNotification] =
  useState({

    show: false,
    type: '',
    message: ''
  });

  useEffect(() => {

    loadNatures();

  }, []);

  const loadNatures =
    async () => {

      try {

        const data =
          await helpDeskApi
            .sosNatures();

        setNatures(data);

      } catch (err) {

        console.error(err);
      }
    };

  const handleChange =
    (field, value) => {

      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    };

    const showNotification =
  (type, message) => {

    setNotification({

      show: true,
      type,
      message
    });

    setTimeout(() => {

      setNotification({

        show: false,
        type: '',
        message: ''
      });

    }, 3000);
  };

  const handleSubmit =
  async (e) => {

    e.preventDefault();

    if (!formData.name.trim()) {

      showNotification(
        'error',
        'Caller name is required.'
      );

      return;
    }

    if (!formData.callerPhone.trim()) {

      showNotification(
        'error',
        'Caller phone is required.'
      );

      return;
    }

    if (!formData.province.trim()) {

      showNotification(
        'error',
        'Province is required.'
      );

      return;
    }

    if (!formData.district.trim()) {

      showNotification(
        'error',
        'District is required.'
      );

      return;
    }

    if (!formData.city.trim()) {

      showNotification(
        'error',
        'City is required.'
      );

      return;
    }

    if (!formData.complaintNatureId) {

      showNotification(
        'error',
        'Emergency nature required.'
      );

      return;
    }

    if (!formData.detail.trim()) {

      showNotification(
        'error',
        'Emergency details required.'
      );

      return;
    }

    setShowConfirm(true);
  };

  const confirmTransmit =
  async () => {

    try {

      setSubmitting(true);

      await helpDeskApi
        .createSOS(formData);

      setShowConfirm(false);

      setShowSuccess(true);

      // CLEAR FORM

      setFormData({

        name: '',
        callerPhone: '',
        province: '',
        district: '',
        town: '',
        area: '',
        city: '',
        complaintNatureId: '',
        priority: 'NORMAL',
        detail: ''
      });

      // AUTO CLOSE SUCCESS

      setTimeout(() => {

        setShowSuccess(false);

      }, 3000);

    } catch (err) {

      console.error(err);

    } finally {

      setSubmitting(false);
    }
  };

  return (

    <div className="
      max-w-5xl mx-auto
      space-y-6
    ">

        {
  notification.show && (

    <div className={`
      fixed top-6 right-6
      z-[100]
      min-w-[320px]
      p-4 rounded-2xl
      border
      backdrop-blur-xl
      animate-fadeIn

      ${
        notification.type === 'error'

          ? `
            bg-red-500/10
            border-red-500/30
            text-red-300
            shadow-[0_0_25px_rgba(255,0,0,0.2)]
          `

          : `
            bg-green-500/10
            border-green-500/30
            text-green-300
            shadow-[0_0_25px_rgba(34,197,94,0.2)]
          `
      }
    `}>

      <div className="
        flex items-center gap-3
      ">

        <span className="text-2xl">

          {
            notification.type === 'error'
              ? '🚨'
              : '✅'
          }

        </span>

        <p className="
          text-sm
          tracking-wide
        ">
          {notification.message}
        </p>

      </div>

    </div>

  )
}

      {/* HEADER */}

      <div className="
        border border-red-500/20
        bg-red-500/5
        rounded-3xl
        p-6
        animate-pulse
      ">

        <h1 className="
          text-3xl
          font-bold
          text-red-400
          tracking-widest
          drop-shadow-[0_0_10px_#ef4444]
        ">

          🚨 CREATE SOS REPORT

        </h1>

        <p className="
          text-red-300/50
          mt-2
        ">

          Emergency transmission console

        </p>

        <p className="
        text-cyan-500/40
        text-xs
        font-mono
        tracking-widest
        mt-3
        ">

  [ SECURE EMERGENCY RESPONSE NETWORK ]

</p>

      </div>

      <div className="
  flex items-center gap-3
  bg-red-500/10
  border border-red-500/20
  rounded-2xl
  p-4
  animate-pulse
">

  <div className="text-3xl">
    🚨
  </div>

  <div>

    <h2 className="
      text-red-400
      font-bold
      tracking-widest
    ">

      EMERGENCY TRANSMISSION ACTIVE

    </h2>

    <p className="
      text-red-300/50
      text-sm
      mt-1
    ">

      Incoming SOS calls are being monitored.

    </p>

  </div>

</div>

      {/* FORM */}

      <form
        onSubmit={handleSubmit}

        className="
          bg-[#071018]
          border border-cyan-500/20
          rounded-3xl
          p-8
          space-y-6
        "
      >

        <div className="
          grid md:grid-cols-2 gap-5
        ">

          <input
            placeholder="Caller Name"

            value={formData.name}

            onChange={(e) =>
              handleChange(
                'name',
                e.target.value
              )
            }

            className="
              bg-black/30
              border border-cyan-500/20
              rounded-xl
              p-4
              text-cyan-100
              outline-none
            "
          />

          <input
            placeholder="Caller Phone"

            value={formData.callerPhone}

            onChange={(e) =>
              handleChange(
                'callerPhone',
                e.target.value
              )
            }

            className="
              bg-black/30
              border border-cyan-500/20
              rounded-xl
              p-4
              text-cyan-100
              outline-none
            "
          />

        </div>

        <div className="
          grid md:grid-cols-2 gap-5
        ">

          <input
            placeholder="Province"

            value={formData.province}

            onChange={(e) =>
              handleChange(
                'province',
                e.target.value
              )
            }

            className="
              bg-black/30
              border border-cyan-500/20
              rounded-xl
              p-4
              text-cyan-100
            "
          />

          <input
            placeholder="District"

            value={formData.district}

            onChange={(e) =>
              handleChange(
                'district',
                e.target.value
              )
            }

            className="
              bg-black/30
              border border-cyan-500/20
              rounded-xl
              p-4
              text-cyan-100
            "
          />

          <input
  placeholder="Town"

  value={formData.town}

  onChange={(e) =>
    handleChange(
      'town',
      e.target.value
    )
  }

  className="
    bg-black/30
    border border-cyan-500/20
    rounded-xl
    p-4
    text-cyan-100
  "
/>

<input
  placeholder="Area"

  value={formData.area}

  onChange={(e) =>
    handleChange(
      'area',
      e.target.value
    )
  }

  className="
    bg-black/30
    border border-cyan-500/20
    rounded-xl
    p-4
    text-cyan-100
  "
/>

<input
  placeholder="City"

  value={formData.city}

  onChange={(e) =>
    handleChange(
      'city',
      e.target.value
    )
  }

  className="
    bg-black/30
    border border-cyan-500/20
    rounded-xl
    p-4
    text-cyan-100
  "
/>

        </div>

        <select
          value={formData.complaintNatureId}

          onChange={(e) =>
            handleChange(
              'complaintNatureId',
              e.target.value
            )
          }

          className="
            w-full
            bg-black/30
            border border-cyan-500/20
            rounded-xl
            p-4
            text-cyan-100
          "
        >

          <option value="">
            Select Nature
          </option>

          {natures.map((nature) => (

            <option
                key={nature.id}
                value={nature.id}
            >

                {nature.description}

            </option>

            ))}

        </select>

<select
  value={formData.priority}

  onChange={(e) =>
    handleChange(
      'priority',
      e.target.value
    )
  }

  className="
    w-full
    bg-black/30
    border border-red-500/20
    rounded-xl
    p-4
    text-red-200
  "
>

  <option value="NORMAL">
    NORMAL
  </option>

  <option value="HIGH">
    HIGH
  </option>

  <option value="CRITICAL">
    CRITICAL
  </option>

</select>

        <textarea
          rows={5}

          placeholder="Emergency Details"

          value={formData.detail}

          onChange={(e) =>
            handleChange(
              'detail',
              e.target.value
            )
          }

          className="
            w-full
            bg-black/30
            border border-cyan-500/20
            rounded-xl
            p-4
            text-cyan-100
          "
        />

        <button
          type="submit"

          className="
            w-full
            py-4
            rounded-2xl
            bg-red-500/20
            border border-red-500
            text-red-300
            font-bold
            tracking-widest
            hover:bg-red-500/30
            transition-all
            shadow-[0_0_20px_rgba(255,0,0,0.2)]
          "
        >

          TRANSMIT SOS REPORT

        </button>

      </form>

{
  showConfirm && (

    <div className="
      fixed inset-0
      bg-black/70
      backdrop-blur-sm
      flex items-center justify-center
      z-50
      animate-fadeIn
    ">

      <div className="
        w-[90%] max-w-md
        bg-[#071018]
        border border-red-500/30
        rounded-3xl
        p-8
        shadow-[0_0_40px_rgba(255,0,0,0.2)]
      ">

        <div className="
          text-center space-y-5
        ">

          <div className="text-6xl">
            🚨
          </div>

          <h2 className="
            text-2xl
            font-bold
            text-red-400
            tracking-widest
          ">

            CONFIRM TRANSMISSION

          </h2>

          <p className="
            text-red-300/60
            text-sm
          ">

            Are you sure you want to
            transmit this SOS report?

          </p>

          <div className="
            flex gap-4 pt-4
          ">

            <button
            type= "button"
              onClick={() =>
                setShowConfirm(false)
              }

              className="
                flex-1
                py-3
                rounded-2xl
                border border-cyan-500/20
                text-cyan-300
                hover:bg-cyan-500/10
                transition-all
              "
            >

              CANCEL

            </button>

            <button
            type="button"
              onClick={confirmTransmit}

              disabled={submitting}

              className="
                flex-1
                py-3
                rounded-2xl
                bg-red-500/20
                border border-red-500
                text-red-300
                hover:bg-red-500/30
                transition-all
              "
            >

              {
                submitting
                  ? 'TRANSMITTING...'
                  : 'TRANSMIT'
              }

            </button>

          </div>

        </div>

      </div>

    </div>

  )
}

{
  showSuccess && (

    <div className="
      fixed inset-0
      bg-black/70
      backdrop-blur-sm
      flex items-center justify-center
      z-50
      animate-fadeIn
    ">

      <div className="
        w-[90%] max-w-md
        bg-[#071018]
        border border-green-500/30
        rounded-3xl
        p-8
        shadow-[0_0_40px_rgba(34,197,94,0.2)]
      ">

        <div className="
          text-center space-y-5
        ">

          <div className="text-6xl">
            ✅
          </div>

          <h2 className="
            text-2xl
            font-bold
            text-green-400
            tracking-widest
          ">

            SOS TRANSMITTED

          </h2>

          <p className="
            text-green-300/60
            text-sm
          ">

            Emergency report successfully
            transmitted to the system.

          </p>

        </div>

      </div>

    </div>

  )
}

<style>{`

@keyframes fadeIn {

  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.animate-fadeIn {

  animation: fadeIn .25s ease-out;
}

`}</style>
    </div>
  );
}