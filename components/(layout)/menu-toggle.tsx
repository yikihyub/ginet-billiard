"use client";

import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import { Sheet, SheetContent } from "../ui/sheet";

const MenuToggle = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const menuItems = [
    {
      title: "회사소개",
      subItems: ["인사말", "정소프트 SHOP", "오시는 길"],
    },
    {
      title: "홈페이지제작",
      subItems: ["홈페이지제작", "쇼핑몰제작", "무료 서비스"],
    },
    {
      title: "포트폴리오",
      subItems: [],
    },
    {
      title: "제작비용",
      subItems: ["홈페이지 제작비용", "쇼핑몰 제작비용", "부가서비스비용"],
    },
    {
      title: "고객센터",
      subItems: ["공지사항", "유지보수 신청"],
    },
  ];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="relative z-50">
      {/* Mobile */}
      {isMobile && (
        <>
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open Menu"
            className="flex items-center w-6 h-6"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent side="left">
              <nav className="space-y-4 pt-10">
                {menuItems.map((item) => (
                  <div key={item.title} className="space-y-2">
                    <div className="font-medium">{item.title}</div>
                    {item.subItems.length > 0 && (
                      <div className="pl-4 space-y-2">
                        {item.subItems.map((subItem) => (
                          <a
                            key={subItem}
                            href="#"
                            className="block text-gray-600"
                          >
                            {subItem}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </>
      )}

      {/* Desktop */}
      {!isMobile && (
        <div className="flex items-center">
          <button
            onClick={() => setIsMenuVisible(!isMenuVisible)}
            className="flex items-center gap-2 mr-4"
            aria-label="Toggle Menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {isMenuVisible && (
            <div className="absolute top-full left-0 bg-white shadow-lg rounded-md mt-2 min-w-max">
              <ul className="flex flex-row gap-4 p-4">
                {menuItems.map((item) => (
                  <li key={item.title} className="relative group">
                    <button className="font-medium hover:text-blue-600">
                      {item.title}
                    </button>
                    {item.subItems.length > 0 && (
                      <div className="absolute hidden group-hover:block left-0 top-full pt-2 min-w-[200px]">
                        <div className="bg-white shadow-lg rounded-md p-2">
                          {item.subItems.map((subItem) => (
                            <a
                              key={subItem}
                              href="#"
                              className="block px-4 py-2 hover:bg-gray-100 rounded-md"
                            >
                              {subItem}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MenuToggle;
