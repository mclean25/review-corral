import { Disclosure, Listbox, Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, Fragment, useState } from "react";
import { useInstallations } from "../hooks/useInstallations";

export interface NavbarProps {
  activeOrganizationAccountId?: number;
}

const userNavigation = [
  { name: "Your Profile", href: "/profile" },
  { name: "Sign out", href: "/signout" },
];

export const Navbar: FC<NavbarProps> = ({ activeOrganizationAccountId }) => {
  const router = useRouter();

  const installations = useInstallations(
    activeOrganizationAccountId !== undefined,
  );

  const activeInstallation =
    installations.data &&
    activeOrganizationAccountId &&
    installations.data.installations.find(
      (installation) => installation.account.id === activeOrganizationAccountId,
    );

  const [currentInstallation, setCurrentInstallation] =
    useState(activeInstallation);

  return (
    <Disclosure as="nav" className="bg-[#f4f4f4]">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <Link href="/" className="">
                  <div className="flex-shrink-0 hover:cursor-pointer">
                    <img
                      className="h-12 w-12"
                      src="https://avatars.githubusercontent.com/in/203068?s=120&u=4f27b80d54a1405e10756a1dc0175d1ef3866422&v=4"
                      alt="Workflow"
                    />
                  </div>
                </Link>

                {activeInstallation && (
                  <>
                    <div className="-mt-0.5 text-3xl text-gray-400 font-extralight">
                      /
                    </div>
                    <div className="rounded-md px-2 py-2 hover:bg-gray-200 flex gap-2 items-center cursor-pointer">
                      {/* <div className="flex items-center space-x-2">
                        <div className="rounded-md overflow-hidden">
                          <img
                            src={activeInstallation.account.avatar_url}
                            width={32}
                            height={32}
                          />
                        </div>
                        <div>{activeInstallation.account.login}</div>
                      </div> */}
                      {/* <SelectorIcon className="h-5 w-5" /> */}
                      <Listbox
                        value={activeInstallation}
                        onChange={(installation) => {}}
                      >
                        <Listbox.Button>
                          {activeInstallation.account.login}
                        </Listbox.Button>
                        <Listbox.Options>
                          {installations.data.installations.map(
                            (installation) => (
                              <Listbox.Option
                                key={installation.id}
                                value={installation}
                              >
                                <div className="flex items-center space-x-2">
                                  <div className="rounded-md overflow-hidden">
                                    <img
                                      src={installation.account.avatar_url}
                                      width={32}
                                      height={32}
                                    />
                                  </div>
                                  <div>{installation.account.login}</div>
                                </div>
                              </Listbox.Option>
                            ),
                          )}
                        </Listbox.Options>
                      </Listbox>
                    </div>
                  </>
                )}
              </div>
              <div className="block">
                <div className="ml-4 flex items-center md:ml-6">
                  <Menu as="div" className="ml-3 relative">
                    <div>
                      <Menu.Button className="max-w-xs bg-slate-200 rounded-full flex items-center text-sm text-black">
                        <span className="sr-only">Open user menu</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {userNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <a
                                href={item.href}
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700",
                                )}
                              >
                                {item.name}
                              </a>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
