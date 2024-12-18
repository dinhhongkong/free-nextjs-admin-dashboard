import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Input } from 'antd';
import { Province } from '@/model/Province';
import { useClickOutside } from '@/hooks/useClickOutside';

interface ProvincePickerProps {
  title: string;
  provinces: Province[];
  onSelectProvince: (province: Province) => void;
}

export default function ProvincePicker({ title, provinces, onSelectProvince }: ProvincePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProvinces, setFilteredProvinces] = useState<Province[] | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useClickOutside(panelRef, () => {
    setIsOpen(false);
  })

  useEffect(() => {
    const filtered = provinces.filter(province =>
      province.provinceName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProvinces(filtered);
  }, [searchTerm, provinces]);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  const handleProvinceSelect = (province: Province) => {
    setSelectedProvince(province);
    onSelectProvince(province);
    setIsOpen(false);
  };
  
  return (
    <div className="relative w-full h-[40px] border rounded-md">
      {isOpen && (
        <div ref={panelRef} className={`absolute bg-white rounded-xl border shadow-md py-2 min-w-[360px] z-30`}>
          <div className={'flex justify-between'}>
            <label className="hidden pl-9 text-sm font-medium lg:block">{title}</label>
            <Image src={"/assets/close.svg"} alt={"close"} width={10} height={10} onClick={togglePanel} className={"mr-5 cursor-pointer"} />
          </div>
          <div className={`py-2`}>
            <div className={`flex px-4`}>
              <span className={`border border-orange-500 cursor-pointer mx-auto rounded-md relative p-4 w-full`}>
                {/* <Input 
                type='text' 
                placeholder={"Nhập " + title.toLowerCase()} 
                value={searchTerm}  
                onChange={(e) => setSearchTerm(e.target.value)} 
                size="large" width={10} /> */}
                <input
                  type={"text"}
                  className={`w-full outline-0 font-normal`}
                  placeholder={"Nhập " + title.toLowerCase()}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </span>
            </div>
            <div className={``}>
              <div className={`px-4 py-3 font-medium uppercase`}>Tỉnh/Thành phố</div>
              <div className={'overflow-y-scroll h-64'}>
                {
                  filteredProvinces?.map(province => (
                    <div
                      key={province.id}
                      className={`flex cursor-pointer border-b border-neutral-200 px-4 py-3 hover:bg-[#FEF6F3] `}
                      onClick={() => handleProvinceSelect(province)}
                    >
                      <div className="cursor-pointer text-[15px] font-medium">{province.provinceName}</div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={"flex items-center w-full h-full"} onClick={togglePanel}>
        <input
          placeholder={"Chọn " + title.toLowerCase()}
          readOnly={true}
          className="max-w-[140px] pl-4 truncate lg:max-w-[220px] font-medium outline-none"
          type={"text"}
          value={selectedProvince ? selectedProvince.provinceName : ''}
        />
      </div>
    </div>
  );
}