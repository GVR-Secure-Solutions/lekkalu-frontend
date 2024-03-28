import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { cn } from '@/utils/utils'
import NavLink from './NavLink'
import { CALCULATOR_ROUTES, ROUTES as _routes } from '@/utils/app-shell'
import { Button } from '@/components/ui/button'
import { SCENARIOS } from '@/utils/query-keys'
import { fetchScenarios } from '@/queries/scenarios'

type SidebarProps = React.HTMLAttributes<HTMLDivElement>

export function Sidebar({ className, ...restProps }: SidebarProps) {
  const [subMenus, setSubMenus] = useState<any>({})
  const [ROUTES, setRoutes] = useState([..._routes])

  useQuery([SCENARIOS.SCENARIOS], fetchScenarios, {
    onSuccess(data) {
      const _scenarioSubMenu = data.map((each) => ({ path: `/scenarios/${each?.id}`, label: each?.name }))
      const clonedRoutes = [...ROUTES]
      const updatedRoutes = clonedRoutes.map((each, index) => {
        if (each.path === '/scenarios') {
          clonedRoutes[index].subMenu = _scenarioSubMenu
        }
        return each
      })
      setRoutes(updatedRoutes)
    },
  })

  useEffect(() => {
    const _subMenus: any = {}
    ROUTES.forEach((route) => {
      if (route.subMenu) {
        _subMenus[route.label] = {
          isExpanded: false,
          show: 3,
        }
      }
    })
    setSubMenus(_subMenus)
  }, [])

  const toggleSubMenuExpand = (label: string) => {
    setSubMenus((each: any) => {
      return {
        ...each,
        [label]: {
          ...each[label],
          isExpanded: !subMenus[label].isExpanded,
        },
      }
    })
  }

  const handleShowMoreSubMenu = (label: string) => {
    setSubMenus((each: any) => {
      return {
        ...each,
        [label]: {
          ...each[label],
          show: subMenus[label].show + 3,
        },
      }
    })
  }

  return (
    <div className={cn('border-r h-full', className)} {...restProps}>
      <div className='space-y-4 py-4 h-full flex flex-col justify-between px-3'>
        <div>
          <Link className='text-center text-2xl font-bold text-primary block' to='/dashboard'>
            finuncle
          </Link>

          <div className='space-y-1 py-2'>
            {ROUTES.map((route) => {
              if (route?.subMenu?.length) {
                return (
                  <>
                    <NavLink
                      key={route.path}
                      to={route.path}
                      label={route.label}
                      icon={route.icon}
                      isParent={!!route?.subMenu}
                      isExpanded={subMenus[route.label]?.isExpanded}
                      toggleExpand={() => toggleSubMenuExpand(route?.label)}
                    />
                    {subMenus[route.label]?.isExpanded &&
                      route?.subMenu?.map((subRoute: any, index: number) => {
                        if (index + 1 <= subMenus[route.label]?.show) {
                          return (
                            <div key={subRoute.path} className='pl-4'>
                              <NavLink to={subRoute.path} label={subRoute.label} icon={subRoute.icon} />
                            </div>
                          )
                        }
                        return <></>
                      })}
                    {subMenus[route.label]?.isExpanded && route?.subMenu?.length > subMenus[route?.label]?.show && (
                      <div className='ml-4 pl-4'>
                        <Button variant={'link'} onClick={() => handleShowMoreSubMenu(route.label)}>
                          Show more
                        </Button>
                      </div>
                    )}
                  </>
                )
              }
              return <NavLink key={route.path} to={route.path} label={route.label} icon={route.icon} />
            })}
          </div>

          <div className='mt-4'>Calculators</div>
          <div className='space-y-1 py-2'>
            {CALCULATOR_ROUTES.map((route) => (
              <NavLink key={route.path} to={route.path} label={route.label} icon={route.icon} />
            ))}
          </div>
        </div>

        {/* <DownloadAllData className='w-full' /> */}
      </div>
    </div>
  )
}
