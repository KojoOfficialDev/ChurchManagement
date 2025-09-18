import React, {ReactNode} from 'react';
import classNames from 'classnames';
import {Button, IconButton} from '@mui/material';
import {Icons} from '../Assets';
type IProp = {
	type?: 'button' | 'reset' | 'submit';
	onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	label?: ReactNode | string;
	children?: ReactNode;
	className?: string;
	loading?: boolean;
	disabled?: boolean;
	attr?: any;
	icon?: any;
	size?: any;
};
export const MtnButton = ({...prop}: IProp) => {
	prop.loading ??= false;
	prop.disabled ??= false;

	return (
		<>
			<button
				disabled={prop.disabled}
				onClick={prop.onClick}
				type={prop.type ?? 'button'}
				className={classNames(
					'mtn-button',
					prop.className,
					{'bg-[#fc0] hover:bg-red-500 text-black hover:text-white': !prop.className?.includes(' bg-')},
					{'mtn-button__disabled': prop.disabled},
					{'cursor-progress': prop.loading},
				)}
				{...prop.attr}
			>
				<span className='pr-2'>{prop.icon}</span>
				{prop.loading ? (
					<span className='dots-cont'>
						<span className='dot dot-1'></span>
						<span className='dot dot-2'></span>
						<span className='dot dot-3'></span>
					</span>
				) : (
					prop.label
				)}
			</button>
		</>
	);
};

export const PreviousMtnButton = ({...prop}: IProp) => {
	prop.loading ??= false;
	prop.disabled ??= false;

	return (
		<>
			<button
				disabled={prop.disabled}
				onClick={prop.onClick}
				type={prop.type ?? 'button'}
				className={classNames(
					'mtn-button',
					prop.className,
					{'bg-[#ed0b97] hover:bg-red-500 text-black hover:text-white': !prop.className?.includes(' bg-')},
					{'mtn-button__disabled': prop.disabled},
					{'cursor-progress': prop.loading},
				)}
				{...prop.attr}
			>
				{prop.loading ? (
					<span className='dots-cont'>
						<span className='dot dot-1'></span>
						<span className='dot dot-2'></span>
						<span className='dot dot-3'></span>
					</span>
				) : (
					prop.label
				)}
			</button>
		</>
	);
};
export const MtnButton1 = ({...prop}: IProp) => {
	prop.loading ??= false;
	prop.disabled ??= false;

	return (
		<>
			<button
				disabled={prop.disabled}
				onClick={prop.onClick}
				type={prop.type ?? 'button'}
				className={classNames(
					prop.className,
					{'bg-[#e008ae] hover:bg-red-500 text-black hover:text-white': !prop.className?.includes(' bg-')},
					'inline-block  px-6 py-2.5 font-medium text-xs leading-tight uppercase rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full',
					{
						'disabled:bg-gray-200 disabled:hover:bg-gray-200 disabled:hover:text-gray-400 disabled:text-gray-400 disabled:shadow-none cursor-not-allowed':
							prop.disabled,
					},
					{'cursor-progress': prop.loading},
				)}
			>
				{prop.loading ? (
					<span className='dots-cont'>
						<span className='dot dot-1'></span>
						<span className='dot dot-2'></span>
						<span className='dot dot-3'></span>
					</span>
				) : (
					prop.label
				)}
			</button>
		</>
	);
};
export const MtnAlertButton = ({...prop}: IProp) => {
	return (
		<>
			<button
				disabled={prop.disabled}
				onClick={prop.onClick}
				type={prop.type ?? 'button'}
				className={classNames(
					prop.className,
					{'bg-[#fc0] hover:bg-red-500 text-black hover:text-white': !prop.className?.includes(' bg-')},
					'inline-block w-max px-2 py-1 font-medium text-xs leading-tight capitalize rounded shadow-sm hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out ',
					{
						'disabled:bg-gray-200 disabled:hover:bg-gray-200 disabled:hover:text-gray-400 disabled:text-gray-400 disabled:shadow-none cursor-not-allowed':
							prop.disabled,
					},
					{'cursor-progress': prop.loading},
				)}
			>
				{prop.loading ? (
					<span className='dots-cont'>
						<span className='dot dot-1'></span>
						<span className='dot dot-2'></span>
						<span className='dot dot-3'></span>
					</span>
				) : (
					<>
						{prop?.label}
						{prop?.children}
					</>
				)}
			</button>
		</>
	);
};

export const AddIconButton = ({...prop}: IProp) => {
	return (
		<>
			<IconButton disabled={prop.disabled} onClick={prop.onClick} type={prop.type ?? 'button'} size={prop.size}>
				{prop.loading ? (
					<span className='dots-cont'>
						<span className='dot dot-1'></span>
						<span className='dot dot-2'></span>
						<span className='dot dot-3'></span>
					</span>
				) : (
					<>{prop.icon}</>
				)}
			</IconButton>
			{/* <button disabled={prop.disabled} onClick={prop.onClick} type={prop.type ?? 'button'}
            className={classNames(
                prop.className,
                { 'bg-[#fc0] hover:bg-red-500 text-black hover:text-white': !prop.className?.includes(' bg-') },
                'inline-block w-max px-2 py-1 font-medium text-xs leading-tight capitalize rounded shadow-sm hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out ',
                { 'disabled:bg-gray-200 disabled:hover:bg-gray-200 disabled:hover:text-gray-400 disabled:text-gray-400 disabled:shadow-none cursor-not-allowed': prop.disabled },
                { 'cursor-progress': prop.loading })}
        >

            {prop.loading ? (
                <span className="dots-cont">
                    <span className="dot dot-1"></span>
                    <span className="dot dot-2"></span>
                    <span className="dot dot-3"></span>
                </span>
            ) : <>{prop?.label}{prop?.children}</>}

        </button> */}
		</>
	);
};
