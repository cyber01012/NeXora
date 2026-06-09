import { useState, useEffect } from 'react';
import {
  UserPlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserCircleIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { authApi } from "../../api/authApi";
import {
  getApiErrorMessage,
} from "../../context/AuthContext";
// import AuthModalCard from "../../components/auth/AuthModalCard";
import AdminResetPasswordForm from "../../components/auth/AdminResetPasswordForm";

import { toast } from "sonner";

const mapAdminRoleToEndpoint = (role) => {

  switch (role) {

    case "HELPDESK":
      return "help-desk";

    case "ASSIGNING_OFFICER":
      return "assigning-officer";

    case "RESPONDER":
      return "responder";

    case "NGO":
      return "ngo";

    default:
      return null;
  }
};

const stripPhoneFormatting = (phone) => {
  return phone.replace(/\D/g, "");
};
/* =========================================================
   USER CARD
========================================================= */

const UserCard = ({ user, onEdit }) => {

  const roleStyles = {
    HELPDESK: {
      icon: '🛠',
      color: '#00f0ff',
      bg: 'rgba(0,240,255,0.12)'
    },

    ASSIGNING_OFFICER: {
      icon: '🧭',
      color: '#c084fc',
      bg: 'rgba(192,132,252,0.12)'
    },

    RESPONDER: {
      icon: '🚑',
      color: '#4ade80',
      bg: 'rgba(74,222,128,0.12)'
    },

    NGO: {
      icon: '🏢',
      color: '#fb923c',
      bg: 'rgba(251,146,60,0.12)'
    }
  };

  const style =
    roleStyles[user.userType] || {
      icon: '👤',
      color: '#06b6d4',
      bg: 'rgba(6,182,212,0.12)'
    };

  return (
    <div
      className="
        bg-[var(--bg2)]
        border border-[var(--border)]
        rounded-2xl
        overflow-hidden
        transition-all duration-300
        hover:border-cyan-500/50
        hover:shadow-[0_0_22px_rgba(0,240,255,0.08)]
        hover:-translate-y-1
      "
    >

      {/* HEADER */}
      <div className="relative overflow-hidden">

        <div className="absolute top-0 right-0 text-8xl opacity-[0.04] pointer-events-none">
          {style.icon}
        </div>

        <div className="p-5">

          <div className="flex justify-between items-start">

            {/* LEFT */}
            <div className="flex gap-4">

              <div
                className="
                  w-14 h-14
                  rounded-full
                  flex items-center justify-center
                  text-2xl
                  border-2
                  flex-shrink-0
                "
                style={{
                  color: style.color,
                  background: style.bg,
                  borderColor: style.color
                }}
              >
                {style.icon}
              </div>

              <div className="min-w-0">

                <h2 className="text-glow-primary font-data text-lg truncate">
                  {user.name}
                </h2>

                <p
                  className="font-mono text-[10px] mt-1 tracking-widest"
                  style={{ color: style.color }}
                >
                  {user.userType}
                </p>

                <div className="
                inline-flex items-center gap-2
                mt-2
                px-2 py-1
                rounded-full
                bg-cyan-500/10
                border border-cyan-500/20
              ">
                <ShieldCheckIcon className="w-3 h-3 text-cyan-300" />

                <p className="text-cyan-300 text-[10px] font-mono">
                  @{user.username}
                </p>
              </div>

              </div>

            </div>

            {/* STATUS */}
            <div
              className={`
                px-2 py-1 rounded-full
                text-[9px]
                font-mono
                border

                ${
                  user.active
                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                    : 'bg-red-500/20 text-red-400 border-red-500/30'
                }
              `}
            >
              {user.active ? (
                <span className="flex items-center gap-1">
                  <CheckCircleIcon className="w-3 h-3" />
                  ACTIVE
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <XCircleIcon className="w-3 h-3" />
                  INACTIVE
                </span>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* BODY */}
      <div className="border-t border-cyan-500/10 p-5 space-y-4 bg-gradient-to-b from-transparent to-cyan-950/5">

        {/* DEPARTMENT */}
        <div className="
          flex items-center justify-between
          bg-black/10
          border border-cyan-500/10
          rounded-lg
          px-3 py-2
        ">
          <span className="text-cyan-400/40 text-[9px] font-mono tracking-wider">
            DEPARTMENT
          </span>

          <span className="text-cyan-200 text-[10px] font-mono">
            {user.deptName || '-'}
          </span>

        </div>

        {/* PHONE */}
        <div className="
        flex items-center justify-between
        bg-black/10
        border border-cyan-500/10
        rounded-lg
        px-3 py-2
      ">

          <span className="text-cyan-400/40 text-[9px] font-mono tracking-wider">
            CONTACT
          </span>

          <span className="text-cyan-200 text-[10px] font-mono">
            {user.contactNumber}
          </span>

        </div>

        {/* EMAIL */}
        <div
        className="
          bg-black/10
          border border-cyan-500/10
          rounded-xl
          p-3
        "
      >

        <p className="text-cyan-400/40 text-[9px] font-mono tracking-wider mb-2">
          EMAIL
        </p>

        <p className="text-cyan-100 text-[11px] font-mono break-all">
          {user.email}
        </p>

      </div>

      {/* PASSWORD STATUS */}

<div
  className="
    bg-gradient-to-r
    from-purple-500/10
    to-cyan-500/10
    border border-purple-500/20
    rounded-xl
    p-3
  "
>

  <div className="flex items-center justify-between">

    <div>

      <p className="text-cyan-400/40 text-[9px] font-mono tracking-wider">
        PASSWORD
      </p>

      <p className="text-purple-200 text-[11px] font-mono mt-1">
        PASSWORD PROTECTED
      </p>

    </div>

    <div
      className="
        px-3 py-1
        rounded-full
        bg-green-500/10
        border border-green-500/20
        text-green-300
        text-[10px]
        font-mono
      "
    >
      SECURED
    </div>

  </div>

</div>

        {/* REMARKS */}
        {!user.active && user.inactiveRemarks && (

          <div
            className="
              bg-red-500/10
              border border-red-500/20
              rounded-xl
              p-3
            "
          >

            <p className="text-red-300 text-[10px] font-mono">
              {user.inactiveRemarks}
            </p>

          </div>

        )}

        {/* EDIT BUTTON */}
<button
  onClick={() => onEdit(user)}
  className="
    w-full
    py-3
    bg-cyan-500/10
    border border-cyan-500/20
    rounded-xl
    text-cyan-200
    font-mono
    text-xs
    hover:bg-cyan-500/20
    transition-all
    flex items-center justify-center gap-2
  "
>

  ✏️ EDIT USER

</button>

      </div>

    </div>
  );
};

/* =========================================================
   CREATE USER MODAL
========================================================= */

const AddUserModal = ({
  isOpen,
  onClose,
  onAdd
}) => {


  const [mode, setMode] = useState('');

  const [errors, setErrors] = useState({});

  const [departments, setDepartments] = useState([]);

  const [formData, setFormData] = useState({

    category: '',
    userType: '',
    deptId: '',

    username: '',
    name: '',
    contactNumber: '',
    email: '',
    password: '',

    active: true,
    inactiveRemarks: ''

  });

useEffect(() => {

  const fetchDepartments = async () => {

    try {

      const data =
        await authApi.getDepartments();

      setDepartments(
        data.map(dept => ({
          id: dept.id,
          deptName: dept.name,
          
          responderTypeCategory:
            dept.responderTypeCategory,

            responderTypeId:
              dept.responderTypeId

        }))
      );

    } catch (error) {

      toast.error(
        "Failed to load departments"
      );
    }
  };

  fetchDepartments();

}, []);

  if (!isOpen) return null;

  const handleChange = (field, value) => {

    setFormData({
      ...formData,
      [field]: value
    });
  };

  const validate = () => {

    const newErrors = {};

    if (!formData.userType)
      newErrors.userType = 'Required';

    if (mode === 'GOV' && !formData.deptId)
      newErrors.deptId = 'Required';

    if (!formData.name.trim())
      newErrors.name = 'Required';

    if (!formData.username.trim())
      newErrors.username = 'Required';

    if (!formData.contactNumber.trim())
      newErrors.contactNumber = 'Required';

    if (!formData.email.trim())
      newErrors.email = 'Required';

    if (!formData.password.trim())
      newErrors.password = 'Required';

    return newErrors;
  };

  const handleSubmit = async () => {

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const deptName =
      departments.find(
        d => String(d.id) === String(formData.deptId)
      )?.deptName || '';

    await onAdd({
  id: Date.now(),
  ...formData,
  deptName,

});
    };

  return (
    <div
      className="
        fixed inset-0
        bg-black/80
        backdrop-blur-md
        flex items-center justify-center
        z-50
        animate-fadeIn
      "
      onClick={onClose}
    >

      <div
        className="
          w-full max-w-3xl
          max-h-[90vh]
          bg-[var(--bg2)]
          border border-[var(--border)]
          rounded-3xl
          overflow-hidden
          animate-scaleIn
          flex flex-col
        "
        onClick={(e) => e.stopPropagation()}
      >

        {/* HEADER */}
        <div
          className="
            p-6
            border-b border-[var(--border)]
            bg-gradient-to-r
            from-cyan-900/20
            to-transparent
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <h2 className="font-title text-glow-primary text-2xl tracking-wider">
                CREATE USER
              </h2>

              <p className="font-mono text-cyan-400/50 text-xs mt-2">
                SYSTEM ACCESS PROVISIONING
              </p>

            </div>

            <button
              onClick={onClose}
              className="text-cyan-400 text-3xl"
            >
              ×
            </button>

          </div>

        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">

          {/* SOURCE */}
          <div>

            <p className="text-purple-300 text-sm tracking-[4px] mb-4">
              USER SOURCE
            </p>

            <div className="flex gap-4 flex-wrap">

              <button
                onClick={() => {
                  setMode('LOCAL');

                  handleChange('category', 'LOCAL');
                }}
                className={`
                  px-6 py-3
                  rounded-xl
                  border
                  transition-all

                  ${
                    mode === 'LOCAL'
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                      : 'border-[var(--border)] text-cyan-400/50'
                  }
                `}
              >
                LOCAL
              </button>

              <button
                onClick={() => {
                  setMode('GOV');

                  handleChange('category', 'GOVERNMENT / NGO');
                }}
                className={`
                  px-6 py-3
                  rounded-xl
                  border
                  transition-all

                  ${
                    mode === 'GOV'
                      ? 'bg-purple-500/20 border-purple-400 text-purple-200'
                      : 'border-[var(--border)] text-cyan-400/50'
                  }
                `}
              >
                GOVERNMENT / NGO
              </button>

            </div>

          </div>

          {/* USER TYPE */}
          {mode && (

            <div>

              <label className="block text-cyan-400/60 text-xs mb-2 tracking-widest">
                USER TYPE
              </label>

              <select
                value={formData.userType}
                onChange={(e) =>
                  handleChange('userType', e.target.value)
                }
                className="
                  w-full
                  bg-[var(--bg3)]
                  border border-[var(--border)]
                  rounded-xl
                  p-4
                  text-cyan-100
                  outline-none
                "
              >

                <option value="">
                  Select User Type
                </option>

                {mode === 'LOCAL' && (
                  <>
                    <option value="HELPDESK">
                      Help Desk
                    </option>

                    <option value="ASSIGNING_OFFICER">
                      Assigning Officer
                    </option>
                  </>
                )}

                {mode === 'GOV' && (
                  <>
                    <option value="RESPONDER">
                      Responder
                    </option>

                    <option value="NGO">
                      NGO
                    </option>
                  </>
                )}

              </select>

            </div>

          )}

          {/* DEPARTMENT */}
          {mode === 'GOV' && formData.userType && (

            <div>

              <label className="block text-cyan-400/60 text-xs mb-2 tracking-widest">
                DEPARTMENT
              </label>

              <select
                value={formData.deptId}
                onChange={(e) =>
                  handleChange('deptId', e.target.value)
                }
                className="
                  w-full
                  bg-[var(--bg3)]
                  border border-[var(--border)]
                  rounded-xl
                  p-4
                  text-cyan-100
                  outline-none
                "
              >

                <option value="">
                  Select Department
                </option>

                {departments
  .filter((dept) => {

    if (
      formData.userType ===
      "NGO"
    ) {
      return (
        dept.responderTypeCategory
        === "NGO"
      );
    }

    if (
      formData.userType ===
      "RESPONDER"
    ) {
      return (
        dept.responderTypeCategory
        === "GOV"
      );
    }

    return true;
  })

  .map((dept) => (

    <option
      key={dept.id}
      value={dept.id}
    >
      {dept.deptName}
    </option>

))}

              </select>

            </div>

          )}

          {/* USER FIELDS */}
          {formData.userType && (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <InputField
                label="FULL NAME"
                value={formData.name}
                onChange={(v) =>
                  handleChange('name', v)
                }
              />

              <InputField
                label="USERNAME"
                value={formData.username}
                onChange={(v) =>
                  handleChange('username', v)
                }
              />

              <InputField
                label="CONTACT NUMBER"
                value={formData.contactNumber}
                onChange={(v) =>
                  handleChange('contactNumber', v)
                }
              />

              <InputField
                label="EMAIL"
                value={formData.email}
                onChange={(v) =>
                  handleChange('email', v)
                }
              />

              <InputField
                label="PASSWORD"
                type="password"
                value={formData.password}
                onChange={(v) =>
                  handleChange('password', v)
                }
              />

            </div>

          )}

       
{/* STATUS */}
{formData.userType && (

  <div className="space-y-4">

    <p className="text-purple-300 text-sm tracking-[4px]">
      ACCOUNT STATUS
    </p>

    <div className="flex gap-4 flex-wrap">

      <button
        type="button"
        onClick={() => handleChange('active', true)}
        className={`
          px-5 py-3
          rounded-xl
          border
          transition-all

          ${
            formData.active
              ? 'bg-green-500/20 border-green-400 text-green-300'
              : 'border-[var(--border)] text-cyan-400/50'
          }
        `}
      >
        ACTIVE
      </button>

      <button
        type="button"
        onClick={() => handleChange('active', false)}
        className={`
          px-5 py-3
          rounded-xl
          border
          transition-all

          ${
            !formData.active
              ? 'bg-red-500/20 border-red-400 text-red-300'
              : 'border-[var(--border)] text-cyan-400/50'
          }
        `}
      >
        INACTIVE
      </button>

    </div>

    {!formData.active && (

      <div>

        <label className="block font-mono text-[10px] text-cyan-400/60 mb-2 tracking-wider">
          INACTIVE REMARKS
        </label>

        <textarea
          value={formData.inactiveRemarks}
          onChange={(e) =>
            handleChange('inactiveRemarks', e.target.value)
          }
          placeholder="Reason for disabling this user..."
          className="
            w-full
            h-28
            bg-[var(--bg3)]
            border border-red-500/30
            rounded-xl
            p-4
            text-cyan-100
            outline-none
          "
        />

      </div>

    )}

  </div>

)}

</div>
    
        {/* FOOTER */}
        <div
          className="
            p-5
            border-t border-[var(--border)]
            flex gap-4
            bg-[var(--bg2)]
          "
        >

          <button
            onClick={handleSubmit}
            className="
              flex-1
              py-3
              bg-cyan-500/20
              border border-cyan-400
              rounded-xl
              text-glow-primary
              font-mono
              tracking-wider
              hover:bg-cyan-500/30
              transition-all
            "
          >
            CREATE USER
          </button>

          <button
            onClick={onClose}
            className="
              flex-1
              py-3
              bg-gray-500/10
              border border-gray-500/30
              rounded-xl
              text-gray-400
              font-mono
            "
          >
            CANCEL
          </button>

        </div>

      </div>

    </div>
  );
};

/* =========================================================
   MAIN PAGE
========================================================= */

export default function AdminUsers() {

    const [
  resettingPassword,
  setResettingPassword
] = useState(false);

  const [users, setUsers] = useState([]);

    const [adding, setAdding] = useState(false);


const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {

  const fetchUsers = async () => {

    try {

      const data =
        await authApi.getAdminUsers();

      setUsers(
  Array.isArray(data)
    ? data
    : data.data || []
);

    } catch (error) {

      toast.error(
        "Failed to fetch users"
      );
    }
  };

  fetchUsers();

}, []);

const openEditModal = (user) => {

  setEditingUser(user);
};


const addUser = async (user) => {

  const endpoint =
    mapAdminRoleToEndpoint(
      user.userType
    );

  if (!endpoint) {

    toast.error("Invalid user type");

    return;
  }

  try {

    const response =
      await authApi.createAdminPortalUser(
        endpoint,
        {
          username: user.username.trim(),

          name: user.name.trim(),

          contactNumber:
            stripPhoneFormatting(
              user.contactNumber
            ),

          email: user.email.trim(),

          password: user.password,

          deptId: user.deptId,

          active: user.active,

          inactiveRemarks:
            user.inactiveRemarks || ''
        }
      );

    toast.success(
      response.message ||
      "User created successfully"
    );

    setUsers([
      {
        ...user,

        id:
          response.data?.id ||
          Date.now()
      },
      ...users
    ]);

    setAdding(false);

  } catch (error) {

    toast.error(
      getApiErrorMessage(
        error,
        "Failed to create user"
      )
    );
  }
};

const updateUser = async () => {

  if (!editingUser) return;

  try {

    await authApi.updateAdminUser(
      editingUser.username,
      {
        name: editingUser.name,

        email: editingUser.email,

        contactNumber:
          stripPhoneFormatting(
            editingUser.contactNumber
          ),

        deptId:
          editingUser.deptId || null,

        active:
          editingUser.active,

        inactiveRemarks:
          editingUser.inactiveRemarks || ''
      }
    );

    setUsers(
      users.map(u =>
        u.username === editingUser.username
          ? editingUser
          : u
      )
    );

    toast.success(
      "User updated successfully"
    );

    setEditingUser(null);

  } catch (error) {

    toast.error(
      getApiErrorMessage(
        error,
        "Failed to update user"
      )
    );
  }
};


  const activeUsers =
    users.filter(user => user.active).length;

  return (
    <div className="space-y-5 animate-fadeIn">

      {/* HEADER */}
      <div className="flex justify-between items-center flex-wrap gap-4">

        <div>

          <h1 className="font-title text-glow-primary text-2xl tracking-wider">
            USER ACCESS CONTROL
          </h1>

          <p className="font-mono text-xs text-cyan-500/60 mt-1">
            [ ADMINISTRATIVE USER MANAGEMENT ]
          </p>

        </div>

        <button
          onClick={() => setAdding(true)}
          className="
            px-5 py-3
            bg-cyan-500/20
            border border-cyan-400
            rounded-xl
            font-mono
            text-sm
            text-glow-primary
            hover:bg-cyan-500/30
            transition-all
            hover:scale-105
            flex items-center gap-2
          "
        >

          <UserPlusIcon className="w-5 h-5" />

          CREATE USER

        </button>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        {[
          {
            label: 'TOTAL USERS',
            value: users.length,
            color: '#06b6d4',
            icon: '👥'
          },

          {
            label: 'ACTIVE USERS',
            value: activeUsers,
            color: '#4ade80',
            icon: '🟢'
          },

          {
            label: 'ACCESS LEVELS',
            value: 4,
            color: '#c084fc',
            icon: '🛡'
          },

          {
            label: 'DEPARTMENTS',
            value: 12,
            color: '#fb923c',
            icon: '🏢'
          }

        ].map((stat, idx) => (

          <div
            key={stat.label}
            className="
              bg-[var(--bg3)]
              border border-[var(--border)]
              rounded-xl
              p-4
              transition-all duration-300
              hover:border-cyan-500/40
              hover:scale-[1.02]
              animate-scaleIn
            "
            style={{
              animationDelay: `${idx * 0.05}s`
            }}
          >

            <div className="flex items-center justify-between mb-2">

              <span className="text-xl">
                {stat.icon}
              </span>

              <span className="text-[9px] font-mono text-cyan-400/60 tracking-wider">
                {stat.label}
              </span>

            </div>

            <h2
              className="font-data text-3xl"
              style={{
                color: stat.color,
                textShadow: `0 0 12px ${stat.color}`
              }}
            >
              {stat.value}
            </h2>

          </div>

        ))}

      </div>

      {/* USERS GRID */}
      {users.length === 0 ? (

        <div
          className="
            bg-[var(--bg2)]
            border border-[var(--border)]
            rounded-2xl
            p-16
            text-center
          "
        >

          <UserCircleIcon className="w-20 h-20 text-cyan-500/20 mx-auto mb-6" />

          <h2 className="text-glow-primary text-xl">
            No Users Created Yet
          </h2>

          <p className="text-cyan-400/40 mt-3 font-mono text-sm">
            Create your first administrative user.
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

          {Array.isArray(users) && users.map((user, idx) => (

            <div
              key={user.name}
              className="animate-slideInRight"
              style={{
                animationDelay: `${idx * 0.05}s`
              }}
            >

              <UserCard
                user={user}
                onEdit={openEditModal}
              />

            </div>

          ))}

        </div>

      )}

{/* EDIT USER MODAL */}

{editingUser && (

  <div
    className="
      fixed inset-0
      bg-black/80
      backdrop-blur-md
      flex items-center justify-center
      z-50
      p-4
    "
  >

    <div
      className="
        w-full max-w-2xl
        bg-[var(--bg2)]
        border border-cyan-500/20
        rounded-3xl
        overflow-hidden
        animate-scaleIn
      "
    >

      {/* HEADER */}

      <div
        className="
          p-6
          border-b border-cyan-500/10
          bg-gradient-to-r
          from-cyan-900/20
          to-transparent
        "
      >

        <div className="flex justify-between items-center">

          <div>

            <h2 className="text-2xl text-glow-primary font-title">
              EDIT USER
            </h2>

            <p className="text-cyan-400/50 text-xs mt-1 font-mono">
              MODIFY USER ACCESS CONFIGURATION
            </p>

          </div>

          <button
            onClick={() =>
              setEditingUser(null)
            }
            className="text-cyan-400 text-3xl"
          >
            ×
          </button>

        </div>

      </div>

      {/* BODY */}

      <div className="p-6 space-y-5">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <InputField
            label="FULL NAME"
            value={editingUser.name}
            onChange={(v) =>
              setEditingUser({
                ...editingUser,
                name: v
              })
            }
          />

          <InputField
            label="USERNAME"
            value={editingUser.username}
            onChange={() => {}}
            readOnly
          />

          <InputField
            label="CONTACT NUMBER"
            value={editingUser.contactNumber}
            onChange={(v) =>
              setEditingUser({
                ...editingUser,
                contactNumber: v
              })
            }
          />

          <InputField
            label="EMAIL"
            value={editingUser.email}
            onChange={(v) =>
              setEditingUser({
                ...editingUser,
                email: v
              })
            }
          />

        </div>

        {/* STATUS */}

        <div className="space-y-4">

          <p className="text-purple-300 text-sm tracking-[4px]">
            ACCOUNT STATUS
          </p>

          <div className="flex gap-4">

            <button
              type="button"
              onClick={() =>
                setEditingUser({
                  ...editingUser,
                  active: true
                })
              }
              className={`
                px-5 py-3 rounded-xl border

                ${
                  editingUser.active
                  ? 'bg-green-500/20 border-green-400 text-green-300'
                  : 'border-[var(--border)] text-cyan-400/50'
                }
              `}
            >
              ACTIVE
            </button>

            <button
              type="button"
              onClick={() =>
                setEditingUser({
                  ...editingUser,
                  active: false
                })
              }
              className={`
                px-5 py-3 rounded-xl border

                ${
                  !editingUser.active
                  ? 'bg-red-500/20 border-red-400 text-red-300'
                  : 'border-[var(--border)] text-cyan-400/50'
                }
              `}
            >
              INACTIVE
            </button>

          </div>

        </div>

        {/* REMARKS */}

        {!editingUser.active && (

          <textarea
            value={
              editingUser.inactiveRemarks || ''
            }

            onChange={(e) =>
              setEditingUser({
                ...editingUser,
                inactiveRemarks:
                  e.target.value
              })
            }

            placeholder="Inactive remarks..."

            className="
              w-full
              h-28
              bg-[var(--bg3)]
              border border-red-500/20
              rounded-xl
              p-4
              text-cyan-100
              outline-none
            "
          />

        )}

        {/* RESET PASSWORD */}
        <button
  onClick={() =>
    setResettingPassword(true)
  }
  className="
    w-full
    py-3
    rounded-xl
    bg-purple-500/10
    border border-purple-500/20
    text-purple-200
    hover:bg-purple-500/20
    transition-all
    font-mono
  "
>

  RESET PASSWORD

</button>

      </div>

      {/* FOOTER */}

      <div
        className="
          p-6
          border-t border-cyan-500/10
          flex gap-4
        "
      >

        <button
          onClick={updateUser}
          className="
            flex-1
            py-3
            bg-cyan-500/20
            border border-cyan-400
            rounded-xl
            text-glow-primary
            font-mono
          "
        >
          SAVE CHANGES
        </button>

        <button
          onClick={() =>
            setEditingUser(null)
          }
          className="
            flex-1
            py-3
            border border-gray-500/20
            rounded-xl
            text-gray-400
          "
        >
          CANCEL
        </button>

      </div>

    </div>

  </div>

)}

{/* RESET PASSWORD MODAL */}

{resettingPassword && editingUser && (

  <div
    className="
      fixed inset-0
      bg-black/80
      backdrop-blur-md
      flex items-center justify-center
      z-[60]
      p-4
    "
  >

    <div
      className="
        w-full max-w-md
        bg-[var(--bg2)]
        border border-purple-500/20
        rounded-3xl
        overflow-hidden
        animate-scaleIn
      "
    >

      {/* HEADER */}
      <div
        className="
          p-6
          border-b border-purple-500/10
          bg-gradient-to-r
          from-purple-900/20
          to-transparent
        "
      >

        <div className="flex justify-between items-center">

          <div>

            <h2 className="text-2xl text-purple-200 font-title">
              RESET PASSWORD
            </h2>

            <p className="text-purple-300/50 text-xs mt-1 font-mono">
              ADMIN PASSWORD RESET
            </p>

          </div>

          <button
            onClick={() =>
              setResettingPassword(false)
            }
            className="text-purple-300 text-3xl"
          >
            ×
          </button>

        </div>

      </div>

      {/* BODY */}
      <div className="p-6">

        <AdminResetPasswordForm

          username={
            editingUser.username
          }

          onSuccess={() => {

            setResettingPassword(false);

            toast.success(
              "Password reset successfully"
            );

          }}

        />

      </div>

    </div>

  </div>

)}

{/* {resettingPassword && editingUser && (

  <AuthModalCard
    title="Reset Password"
    onClose={() =>
      setResettingPassword(false)
    }
  >

    <AdminResetPasswordForm

      username={
        editingUser.username
      }

      onSuccess={() => {

        setResettingPassword(false);

        toast.success(
          "Password reset successfully"
        );

      }}

    />

  </AuthModalCard>

)} */}

      {/* MODAL */}
      <AddUserModal
        isOpen={adding}
        onClose={() => setAdding(false)}
        onAdd={addUser}
      />

      {/* ANIMATIONS */}
      <style>{`

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideInRight {
          animation: slideInRight 0.4s ease-out forwards;
          opacity: 0;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
          opacity: 0;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(6,182,212,0.1);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6,182,212,0.4);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(6,182,212,0.7);
        }

      `}</style>

    </div>
  );
}

/* =========================================================
   INPUT FIELD
========================================================= */

function InputField({
  label,
  value,
  onChange,
  type = 'text',
  readOnly = false
}) {

  return (
    <div>

      <label className="block font-mono text-[10px] text-cyan-400/60 mb-2 tracking-wider">
        {label}
      </label>

      <input
        type={type}
        value={value}
        readOnly={readOnly}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="
          w-full
          bg-[var(--bg3)]
          border border-[var(--border)]
          rounded-xl
          p-3
          text-cyan-100
          outline-none
          focus:border-cyan-400
          transition-all
        "
      />

    </div>
  );
}