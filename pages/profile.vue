<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Profile Header with Breadcrumb -->
    <div class="bg-gray-50">
      <div class="max-w-6xl mx-auto p-4">
        <nav class="flex items-center space-x-2 text-sm mb-2" aria-label="Breadcrumb">
          <NuxtLink to="/" class="text-gray-500 hover:text-gray-700">
            <HomeIcon class="h-4 w-4 inline mr-1" />
            Home
          </NuxtLink>
          <ChevronRightIcon class="h-4 w-4 text-gray-400" />
          <span class="text-gray-900 font-medium">My Account</span>
        </nav>
        <h1 class="text-3xl font-bold text-gray-900 mt-2">My Account</h1>
      </div>
    </div>

    <!-- Profile Content -->
    <div class="max-w-6xl mx-auto px-4 py-10">
      <div v-if="user" class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Left Sidebar -->
        <div class="md:col-span-1 space-y-6">
          <!-- Profile Card -->
          <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div class="bg-gradient-to-r from-indigo-500 to-purple-500 text-center text-white p-6">
              <div class="inline-block relative mb-4">
                <div class="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                  <img v-if="user.photoURL" :src="user.photoURL" class="w-full h-full rounded-full object-cover" />
                  <span v-else>{{ userInitials }}</span>
                </div>
                <div class="absolute bottom-0 right-0 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
              </div>
              <h2 class="text-xl font-bold">{{ user.name || "User" }}</h2>
              <p class="text-white/80 text-sm">{{ user.email }}</p>
            </div>
            
            <!-- Navigation Menu -->
            <div class="p-2">
              <button class="w-full flex items-center gap-3 p-3 text-left rounded-lg mb-1 bg-indigo-100 text-indigo-800 font-medium hover:bg-indigo-200 transition-colors">
                <UserIcon class="h-5 w-5" />
                <span>My Profile</span>
              </button>
              <button class="w-full flex items-center gap-3 p-3 text-left rounded-lg mb-1 text-gray-700 hover:bg-gray-50 transition-colors">
                <ShoppingCartIcon class="h-5 w-5" />
                <span>Order History</span>
              </button>
              <button class="w-full flex items-center gap-3 p-3 text-left rounded-lg mb-1 text-gray-700 hover:bg-gray-50 transition-colors">
                <HeartIcon class="h-5 w-5" />
                <span>Wishlist</span>
              </button>
              <button class="w-full flex items-center gap-3 p-3 text-left rounded-lg mb-1 text-gray-700 hover:bg-gray-50 transition-colors">
                <CreditCardIcon class="h-5 w-5" />
                <span>Payment Methods</span>
              </button>
              
              <!-- Delete Account with Confirmation Dialog -->
              <button @click="openDeleteDialog" class="w-full flex items-center gap-3 p-3 text-left rounded-lg mb-1 text-gray-700 hover:bg-gray-50 transition-colors">
                <TrashIcon class="h-5 w-5" />
                <span>Delete Account</span>
              </button>
              
              <button @click="handleLogout" class="w-full flex items-center gap-3 p-3 text-left rounded-lg text-red-600 hover:bg-red-50 transition-colors">
                <ArrowRightOnRectangleIcon class="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          <!-- Member Stats Card -->
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">Account Statistics</h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="text-center p-3 bg-purple-50 rounded-lg">
                <div class="text-2xl font-bold text-purple-600">5</div>
                <div class="text-xs text-gray-500 mt-1">Orders</div>
              </div>
              <div class="text-center p-3 bg-indigo-50 rounded-lg">
                <div class="text-2xl font-bold text-indigo-600">2</div>
                <div class="text-xs text-gray-500 mt-1">Reviews</div>
              </div>
              <div class="text-center p-3 bg-pink-50 rounded-lg">
                <div class="text-2xl font-bold text-pink-600">8</div>
                <div class="text-xs text-gray-500 mt-1">Wishlisted</div>
              </div>
              <div class="text-center p-3 bg-blue-50 rounded-lg">
                <div class="text-2xl font-bold text-blue-600">750</div>
                <div class="text-xs text-gray-500 mt-1">Points</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Content - Edit Profile Form -->
        <div class="md:col-span-2 space-y-6">
          <!-- Profile Information Card -->
          <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div class="border-b p-6">
              <h2 class="text-lg font-semibold text-gray-900">Profile Information</h2>
              <p class="text-sm text-gray-600">Update your account information</p>
            </div>
            <form @submit.prevent="saveProfile" class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- First Name -->
                <div class="space-y-2">
                  <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
                  <input 
                    id="firstName" 
                    v-model="profile.firstName" 
                    placeholder="John" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>

                <!-- Last Name -->
                <div class="space-y-2">
                  <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
                  <input 
                    id="lastName" 
                    v-model="profile.lastName" 
                    placeholder="Doe" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>

                <!-- Email -->
                <div class="space-y-2">
                  <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
                  <input 
                    id="email" 
                    v-model="profile.email" 
                    disabled 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>

                <!-- Phone -->
                <div class="space-y-2">
                  <label for="phone" class="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input 
                    id="phone" 
                    v-model="profile.phone" 
                    placeholder="+62 812-3456-7890" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>

                <!-- Birthday -->
                <div class="space-y-2">
                  <label for="birthday" class="block text-sm font-medium text-gray-700">Birthday</label>
                  <input 
                    id="birthday" 
                    type="date" 
                    v-model="profile.birthday" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>

                <!-- Gender Select -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Gender</label>
                  <Listbox v-model="selectedGender">
                    <div class="relative">
                      <ListboxButton class="relative w-full cursor-pointer rounded-md bg-white py-2 pl-3 pr-10 text-left border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                        <span class="block truncate">{{ selectedGender?.name || 'Select Gender' }}</span>
                        <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </span>
                      </ListboxButton>

                      <transition
                        leave-active-class="transition duration-100 ease-in"
                        leave-from-class="opacity-100"
                        leave-to-class="opacity-0"
                      >
                        <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          <ListboxOption
                            v-slot="{ active, selected }"
                            v-for="gender in genderOptions"
                            :key="gender.value"
                            :value="gender"
                            as="template"
                          >
                            <li :class="[
                              active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900',
                              'relative cursor-pointer select-none py-2 pl-10 pr-4'
                            ]">
                              <span :class="[
                                selected ? 'font-medium' : 'font-normal',
                                'block truncate'
                              ]">
                                {{ gender.name }}
                              </span>
                              <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                                <CheckIcon class="h-5 w-5" aria-hidden="true" />
                              </span>
                            </li>
                          </ListboxOption>
                        </ListboxOptions>
                      </transition>
                    </div>
                  </Listbox>
                </div>
              </div>

              <!-- Address -->
              <div class="mt-8">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Address Information</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Street Address -->
                  <div class="md:col-span-2 space-y-2">
                    <label for="street" class="block text-sm font-medium text-gray-700">Street Address</label>
                    <input 
                      id="street" 
                      v-model="profile.address.street" 
                      placeholder="Jl. Sudirman No. 123" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <!-- City -->
                  <div class="space-y-2">
                    <label for="city" class="block text-sm font-medium text-gray-700">City</label>
                    <input 
                      id="city" 
                      v-model="profile.address.city" 
                      placeholder="Jakarta" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <!-- Province -->
                  <div class="space-y-2">
                    <label for="province" class="block text-sm font-medium text-gray-700">Province</label>
                    <input 
                      id="province" 
                      v-model="profile.address.province" 
                      placeholder="DKI Jakarta" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <!-- Postal Code -->
                  <div class="space-y-2">
                    <label for="postalCode" class="block text-sm font-medium text-gray-700">Postal Code</label>
                    <input 
                      id="postalCode" 
                      v-model="profile.address.postalCode" 
                      placeholder="12345" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <!-- Country Select -->
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Country</label>
                    <Listbox v-model="selectedCountry">
                      <div class="relative">
                        <ListboxButton class="relative w-full cursor-pointer rounded-md bg-white py-2 pl-3 pr-10 text-left border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                          <span class="block truncate">{{ selectedCountry?.name || 'Select Country' }}</span>
                          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </span>
                        </ListboxButton>

                        <transition
                          leave-active-class="transition duration-100 ease-in"
                          leave-from-class="opacity-100"
                          leave-to-class="opacity-0"
                        >
                          <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            <ListboxOption
                              v-slot="{ active, selected }"
                              v-for="country in countryOptions"
                              :key="country.value"
                              :value="country"
                              as="template"
                            >
                              <li :class="[
                                active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900',
                                'relative cursor-pointer select-none py-2 pl-10 pr-4'
                              ]">
                                <span :class="[
                                  selected ? 'font-medium' : 'font-normal',
                                  'block truncate'
                                ]">
                                  {{ country.name }}
                                </span>
                                <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                                  <CheckIcon class="h-5 w-5" aria-hidden="true" />
                                </span>
                              </li>
                            </ListboxOption>
                          </ListboxOptions>
                        </transition>
                      </div>
                    </Listbox>
                  </div>
                </div>
              </div>

              <!-- Preferences -->
              <div class="mt-8">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Preferences</h3>
                <div class="space-y-4">
                  <div class="flex items-center">
                    <input 
                      id="newsletter" 
                      type="checkbox" 
                      v-model="profile.preferences.newsletter" 
                      class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label for="newsletter" class="ml-3 text-sm text-gray-900">
                      Subscribe to newsletter
                    </label>
                  </div>
                  
                  <div class="flex items-center">
                    <input 
                      id="sms" 
                      type="checkbox" 
                      v-model="profile.preferences.sms" 
                      class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label for="sms" class="ml-3 text-sm text-gray-900">
                      Receive SMS notifications
                    </label>
                  </div>
                  
                  <div class="flex items-center">
                    <input 
                      id="promotions" 
                      type="checkbox" 
                      v-model="profile.preferences.promotions" 
                      class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label for="promotions" class="ml-3 text-sm text-gray-900">
                      Receive special promotions and discounts
                    </label>
                  </div>
                </div>
              </div>

              <!-- Save Button -->
              <div class="mt-8 flex justify-end">
                <button 
                  type="submit" 
                  class="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          <!-- Recent Orders Card -->
          <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div class="border-b p-6">
              <h2 class="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <p class="text-sm text-gray-600">Your latest purchases</p>
            </div>
            <div class="p-6">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="(order, index) in recentOrders" :key="index" class="hover:bg-gray-50 transition-colors">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{{ order.id }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.date }}</td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span :class="getStatusClass(order.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                          {{ order.status }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                        Rp {{ order.total.toLocaleString() }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="mt-6 text-center">
                <button class="text-indigo-600 hover:text-indigo-500 font-medium text-sm transition-colors">
                  View All Orders →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Not Logged In State -->
      <div v-else class="flex justify-center">
        <div class="w-full max-w-md text-center bg-white rounded-lg shadow-sm border p-8">
          <div class="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <LockClosedIcon class="h-10 w-10 text-red-500" />
          </div>
          <h2 class="text-xl font-semibold text-gray-900 mb-2">Not Logged In</h2>
          <p class="text-gray-600 mb-6">
            You need to login to access your profile information.
          </p>
          <div class="flex justify-center space-x-4">
            <NuxtLink 
              to="/login" 
              class="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              Login Now
            </NuxtLink>
            <NuxtLink 
              to="/register" 
              class="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              Register
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <Dialog :open="isDeleteDialogOpen" @close="setDeleteDialogOpen" class="relative z-50">
      <div class="fixed inset-0 bg-black/25" />
      
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
            <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
              Delete Account
            </DialogTitle>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data.
              </p>
            </div>

            <div class="mt-4 flex space-x-3">
              <button
                type="button"
                class="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 transition-colors"
                @click="confirmDelete"
              >
                Delete Account
              </button>
              <button
                type="button"
                class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-colors"
                @click="setDeleteDialogOpen(false)"
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { onMounted, reactive, computed, ref } from "vue";
import { useAuth } from "~/composables/useAuth";

// Headless UI components
import { Dialog, DialogPanel, DialogTitle, Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'

// Heroicons
import { 
  HomeIcon,
  ChevronRightIcon,
  UserIcon, 
  ShoppingCartIcon, 
  HeartIcon, 
  CreditCardIcon, 
  TrashIcon, 
  ArrowRightOnRectangleIcon, 
  LockClosedIcon,
  ChevronUpDownIcon,
  CheckIcon
} from '@heroicons/vue/24/outline'

const user = useAuth();
const router = useRouter();

// Dialog state
const isDeleteDialogOpen = ref(false);

// Select options
const genderOptions = [
  { value: 'male', name: 'Male' },
  { value: 'female', name: 'Female' },
  { value: 'other', name: 'Prefer not to say' }
];

const countryOptions = [
  { value: 'indonesia', name: 'Indonesia' },
  { value: 'malaysia', name: 'Malaysia' },
  { value: 'singapore', name: 'Singapore' },
  { value: 'thailand', name: 'Thailand' },
  { value: 'vietnam', name: 'Vietnam' }
];

// Selected values for dropdowns
const selectedGender = ref(genderOptions[0]);
const selectedCountry = ref(countryOptions[0]);

// Profile form data
const profile = reactive({
  firstName: user.value?.name?.split(" ")[0] || "",
  lastName: user.value?.name?.split(" ")[1] || "",
  email: user.value?.email || "",
  phone: "",
  birthday: "",
  gender: "",
  address: {
    street: "",
    city: "",
    province: "",
    postalCode: "",
    country: "Indonesia",
  },
  preferences: {
    newsletter: true,
    sms: false,
    promotions: true,
  },
});

// Mock recent orders data
const recentOrders = [
  { id: "1092786", date: "04 Apr 2025", status: "Delivered", total: 850000 },
  { id: "1092654", date: "28 Mar 2025", status: "Processing", total: 1250000 },
  { id: "1092543", date: "15 Mar 2025", status: "Shipped", total: 450000 },
  { id: "1092432", date: "02 Mar 2025", status: "Delivered", total: 750000 },
];

// Helper functions
const getStatusClass = (status) => {
  switch (status) {
    case "Delivered": return "bg-green-100 text-green-800";
    case "Processing": return "bg-yellow-100 text-yellow-800";
    case "Shipped": return "bg-blue-100 text-blue-800";
    case "Cancelled": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

// Compute user initials for avatar fallback
const userInitials = computed(() => {
  if (!user.value?.name) return "U";
  const parts = user.value.name.split(" ");
  return parts.length > 1 
    ? `${parts[0][0]}${parts[1][0]}` 
    : parts[0][0];
});

// Dialog functions
const openDeleteDialog = () => {
  isDeleteDialogOpen.value = true;
};

const setDeleteDialogOpen = (value) => {
  isDeleteDialogOpen.value = value;
};

const confirmDelete = () => {
  alert("Account deletion feature would be implemented here");
  setDeleteDialogOpen(false);
};

// Middleware to check if user is logged in
onMounted(() => {
  if (!user.value) {
    router.push("/login");
  }
});

// Form submission handler
const saveProfile = () => {
  alert("Profile information saved successfully!");
  if (user.value) {
    const fullName = `${profile.firstName} ${profile.lastName}`.trim();
    if (fullName && fullName !== user.value.name) {
      user.value.name = fullName;
      localStorage.setItem("user", JSON.stringify(user.value));
    }
  }
};

const handleLogout = () => {
  user.value = null;
  localStorage.removeItem("user");
  router.push("/");
};
</script>

<style scoped>
/* Custom gradient background for cards */
.card-gradient {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
}

/* Custom styles for the avatar status indicator */
.avatar-status {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 1.25rem;
  height: 1.25rem;
  background-color: #10b981;
  border-radius: 9999px;
  border-width: 2px;
  border-color: white;
}

/* Smooth transitions for interactive elements */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Enhanced focus states */
input:focus,
select:focus,
button:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

/* Custom scrollbar for select dropdowns */
.scrollbar-thin {
  scrollbar-width: thin;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Animation for dialog entrance */
@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in-scale {
  animation: fadeInScale 0.2s ease-out;
}

/* Hover effects for cards */
.card-hover {
  transition: box-shadow 0.3s ease;
}

.card-hover:hover {
  box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Custom checkbox styling */
input[type="checkbox"]:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m13.854 3.646-6-6a.5.5 0 0 0-.708 0l-6 6a.5.5 0 1 0 .708.708L7 4.207l5.146 5.147a.5.5 0 0 0 .708-.708z'/%3e%3c/svg%3e");
}

/* Responsive table styling */
@media (max-width: 640px) {
  .table-responsive {
    font-size: 0.875rem;
  }
  
  .table-responsive th,
  .table-responsive td {
    padding: 0.5rem 0.25rem;
  }
}
</style>