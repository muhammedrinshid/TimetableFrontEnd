import React from 'react';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import ClassIcon from '@mui/icons-material/Class';
import SaveIcon from '@mui/icons-material/Save';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import { useLocation, Link as RouterLink } from 'react-router-dom';

function getIconForPath(path) {
  switch (path) {
    case 'teachers':
      return <PeopleIcon sx={{ mr: 0.5 }} fontSize="inherit" />;
    case 'classes':
      return <ClassIcon sx={{ mr: 0.5 }} fontSize="inherit" />;
    case 'saved-timetables':
      return <SaveIcon sx={{ mr: 0.5 }} fontSize="inherit" />;
    case 'user-configurations':
      return <SettingsIcon sx={{ mr: 0.5 }} fontSize="inherit" />;
    case 'user-profile':
      return <PersonIcon sx={{ mr: 0.5 }} fontSize="inherit" />;
    default:
      return null;
  }
}

function getBreadcrumbs(pathname) {
  const pathnames = pathname.split('/').filter(x => x);
  const breadcrumbPaths = pathnames.map((value, index) => {
    const href = `/${pathnames.slice(0, index + 1).join('/')}`;
    return {
      label: value.replace(/-/g, ' ').toUpperCase(),
      href,
      icon: getIconForPath(value),
    };
  });
  return [{ label: 'Home', href: '/', icon: <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" /> }, ...breadcrumbPaths];
}

export default function IconBreadcrumbs() {
  const location = useLocation();
  const breadcrumbs = getBreadcrumbs(location.pathname);

  return (
    <div role="presentation">
      <Breadcrumbs aria-label="breadcrumb">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            {index < breadcrumbs.length - 1 ? (
              <Link
                underline="hover"
                sx={{ display: 'flex', alignItems: 'center' }}
                color="inherit"
                component={RouterLink}
                to={crumb.href}
              >
                {crumb.icon}
                <Typography sx={{ display: 'inline', ml: 0.5 }}>{crumb.label}</Typography>
              </Link>
            ) : (
              <Typography
                sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}
              >
                {crumb.icon}
                <Typography sx={{ display: 'inline', ml: 0.5 }}>{crumb.label}</Typography>
              </Typography>
            )}
          </React.Fragment>
        ))}
      </Breadcrumbs>
    </div>
  );
}
