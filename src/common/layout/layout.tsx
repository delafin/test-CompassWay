import { type NextPage } from 'next';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

type TLayout = {
	children: React.ReactNode;
};

const Layout: NextPage<TLayout> = ({ children }) => {
	const { data: session } = useSession();
	return (
		<section className='py-14 bg-gray-100'>
			<div className='container'>
				<div className='grid grid-cols-4 gap-4'>
					{/* Head */}
					<div className='relative w-full overflow-hidden bg-transparent col-span-4'>
						<div className='w-full flex items-center justify-center min-w-full flex-col md:justify-between md:flex-row rounded-lg bg-white p-6 dark:bg-[#221F2C] gap-4'>
							<div className='flex items-center justify-center flex-col md:flex-row md:justify-between gap-5'>
								<p className='text-center text-3xl text-black dark:text-white'>Dashboard</p>
								<div className='flex items-center justify-left gap-1 flex-wrap self-start md:self-auto'>
									<p className='text-black'>Name:</p>
									<p className='text-black'>
										{session?.user?.name?.length! > 20
											? session?.user?.name?.slice(0, 20)
											: session?.user?.name}
									</p>
								</div>
								<div className='flex items-center justify-left gap-1 flex-wrap self-start md:self-auto'>
									<p className='text-black'>Email:</p>
									<a href={`mailto:${session?.user?.email}`} className='text-black'>
										{session?.user?.email}
									</a>
								</div>
								<div className='flex items-center justify-left gap-1 flex-wrap self-start md:self-auto'>
									<p className='text-black'>Login:</p>
									{session?.user?.login ? (
										<p className='text-black'>{session?.user?.login}</p>
									) : (
										<p className='text-black'>Available only after registration with your credentials!</p>
									)}
								</div>
							</div>
							<button
								className='block relative w-full md:w-auto font-medium cursor-pointer overflow-hidden rounded-md px-4 py-2 text-center text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 flex-shrink'
								onClick={() => signOut()}
							>
								Sign Out
							</button>
						</div>
					</div>
					{/* Navigation */}
					<div className='relative overflow-hidden bg-transparent col-span-4 md:col-span-1'>
						<div className='relative flex h-auto w-full items-start justify-start transition-all'>
							<div className='w-full min-w-full rounded-lg bg-white p-6 dark:bg-[#221F2C]'>
								<ul className='flex items-center justify-between gap-4 flex-col'>
									<li className='w-full'>
										<Link
											className='block relative font-medium cursor-pointer overflow-hidden rounded-md px-4 py-2 text-center text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 flex-shrink'
											href={`/dashboard/`}
										>
											Send Email
										</Link>
									</li>
									<li className='w-full'>
										<Link
											className='block relative font-medium cursor-pointer overflow-hidden rounded-md px-4 py-2 text-center text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 flex-shrink'
											href={`/dashboard/history/`}
										>
											History
										</Link>
									</li>
								</ul>
							</div>
						</div>
					</div>
					{/* Pages */}
					<div className='relative overflow-hidden bg-transparent col-span-4 md:col-span-3 flex w-full min-w-full items-start justify-center transition-all rounded-lg bg-white p-6 dark:bg-[#221F2C] h-min'>
						{children}
					</div>
				</div>
			</div>
		</section>
	);
};

export default Layout;
